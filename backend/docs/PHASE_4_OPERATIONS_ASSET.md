# 🏢 TÀI LIỆU KỸ THUẬT GIAI ĐOẠN 4: VẬN HÀNH ĐÔ THỊ, NGHIỆM THU BÀN GIAO, THỊ TRƯỜNG THỨ CẤP & QUẢN TRỊ GIA SẢN VIP

> **Phiên bản:** 4.0.0  
> **Kiến trúc:** Lục Giác Độc Lập Framework (Hexagonal Ports & Adapters Architecture)  
> **CSDL:** PostgreSQL 16 & Redis 7 Docker Containers  
> **Độ phủ E2E:** 17/17 Tests Giai đoạn 4 Pass • 94/94 Tests Toàn Hệ Thống Pass (100%)

---

## 🎯 1. TỔNG QUAN NGHIỆP VỤ GIAI ĐOẠN 4

Giai đoạn 4 mở rộng hệ thống Nova CRM từ giai đoạn bán hàng dự án sơ cấp (Primary Sales) sang toàn bộ vòng đời hậu bán hàng (Post-sales Lifecycle), biến nền tảng thành một hệ sinh thái PropTech khép kín toàn diện gồm 4 trụ cột chiến lược:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   HỆ SINH THÁI PROPTECH VÒNG ĐỜI HẬU BÁN HÀNG                     │
├─────────────────────┬────────────────────┬───────────────────┬───────────────────┤
│    1. HANDOVER      │   2. OPERATIONS    │     3. RESALE     │   4. PORTFOLIO    │
│  Nghiệm Thu Bàn Giao│ Vận Hành Đô Thị    │ Ký Gửi Thứ Cấp    │ Quản Lý Gia Sản   │
│  & Snagging Defect  │ & Phí Dịch Vụ      │ & Co-brokering    │ VIP Wealth Engine │
├─────────────────────┼────────────────────┼───────────────────┼───────────────────┤
│ • 50 Tiêu chí ISO   │ • Thu phí VietQR   │ • AI Matchmaking  │ • IRR Newton-     │
│ • SLA Nhà thầu      │ • Giấy phép fit-out│ • Chia hoa hồng   │   Raphson         │
│ • Sổ hồng 5 cấp     │ • Tiện ích QR Code │   50/50 tự động   │ • CAGR, Yield,    │
│ • Ký số nhận nhà    │ • Sự cố 24/7       │ • Chốt cọc online │   Exit Simulation │
└─────────────────────┴────────────────────┴───────────────────┴───────────────────┘
```

---

## 🏛️ 2. THIẾT KẾ KIẾN TRÚC LỤC GIÁC (HEXAGONAL ARCHITECTURE)

Tuân thủ nguyên lý *Dependency Inversion*: Lõi nghiệp vụ (Domain) hoàn toàn độc lập với Framework NestJS và CSDL Prisma.

```
                              TẦNG GIAO TIẾP & ĐIỀU KHIỂN (DRIVING ADAPTERS)
                      ┌────────────────────────────────────────────────────────┐
                      │  HandoverController  •  OperationsController           │
                      │  ResaleController    •  PortfolioController            │
                      └───────────────────────────┬────────────────────────────┘
                                                  │
                                                  ▼
                                       INBOUND PORTS (USE CASES)
                      ┌────────────────────────────────────────────────────────┐
                      │  HandoverUseCase     •  OperationsUseCase              │
                      │  ResaleUseCase       •  PortfolioUseCase               │
                      └───────────────────────────┬────────────────────────────┘
                                                  │
                                                  ▼
                                       LÕI NGHIỆP VỤ THUẦN TÚY (DOMAIN)
                      ┌────────────────────────────────────────────────────────┐
                      │  • HandoverTicketEntity (Checklist 50 tiêu chí)        │
                      │  • SnaggingDefectEntity (Phân loại, SLA bảo hành)      │
                      │  • OperationBillEntity (Tính phí diện tích, VietQR)    │
                      │  • FitoutPermitEntity (Ký quỹ, kiểm soát thi công)     │
                      │  • MatchmakingEngine (AI chấm điểm tương thích 0-100)  │
                      │  • FinancialEngine (IRR, CAGR, Rental Yield, Exit Sim) │
                      └───────────────────────────┬────────────────────────────┘
                                                  │
                                                  ▼
                                      OUTBOUND PORTS (SPI REPOSITORIES)
                      ┌────────────────────────────────────────────────────────┐
                      │  HandoverRepoPort    •  OperationsRepoPort             │
                      │  ResaleRepoPort      •  PortfolioRepoPort              │
                      └───────────────────────────┬────────────────────────────┘
                                                  │
                                                  ▼
                               TẦNG KẾT NỐI HẠ TẦNG CSDL (DRIVEN ADAPTERS)
                      ┌────────────────────────────────────────────────────────┐
                      │  PrismaHandoverRepositoryAdapter                       │
                      │  PrismaOperationsRepositoryAdapter                     │
                      │  PrismaResaleRepositoryAdapter                         │
                      │  PrismaPortfolioRepositoryAdapter                      │
                      │             ▼                      ▼                   │
                      │  PostgreSQL 16 novacrm_db    Redis 7 Cache             │
                      └────────────────────────────────────────────────────────┘
```

---

## 📋 3. BỐN PHÂN HỆ NGHIỆP VỤ CHI TIẾT

### 3.1. Phân Hệ 1: Bàn Giao Căn Hộ & Nghiệm Thu Khiếm Khuyết (`modules/handover`)
- **Bộ 50 tiêu chí kiểm định kỹ thuật nghiệm thu tiêu chuẩn ISO 9001**:
  1. *Kiến trúc & Kết cấu (10 tiêu chí)*: Tường trát phẳng không nứt chân chim, sơn nội thất 2 lớp, ron gạch 2mm, độ dốc ban công thoát nước đạt chuẩn, chống thấm sàn WC, lan can kính cường lực 12mm chịu lực, cao độ trần thạch cao chìm, cửa chống cháy kín khít, cửa nhôm Xingfa kín nước, gioăng cao su đàn hồi.
  2. *Cơ điện & Chiếu sáng M&E (10 tiêu chí)*: Aptomat chống giật RCBO ngắt chuẩn, tiếp địa an toàn ổ cắm, công tắc SmartHome < 100ms, đèn LED downlight chuẩn góc chiếu, ống đồng nén Nitơ 450 PSI, Video Doorphone sảnh, sơ đồ đấu nối tủ điện, cáp quang Internet, quạt hút mùi < 42dB, đèn thoát hiểm 120 phút.
  3. *Cấp thoát nước & TB Vệ sinh (10 tiêu chí)*: Áp lực sen tắm 2.5 - 3.5 bar, bồn cầu xả xoáy siphon êm ái, phễu thu sàn bẫy nước ngăn mùi 100%, vòi lavabo mạ Crom, van khóa tổng nhạy, bình nóng lạnh 75°C, ống thoát điều hòa dốc thoát tự do, bơm tăng áp êm, đồng hồ nước kẹp chì, mối hàn ống PPR kín nước.
  4. *Nội thất rời & Thiết bị bàn giao (10 tiêu chí)*: Khóa thông minh vân tay Hafele, bếp từ 3 vùng nấu nhận diện đáy nồi, hút mùi 750m3/h than hoạt tính, mặt đá Vicostone chống thấm ố, bản lề giảm chấn Blum, tủ âm tường gỗ An Cường E1, sàn gỗ 12mm chịu nước, gương sương cảm ứng LED, rèm âm trần 5 sao, tay nắm inox 304.
  5. *An toàn PCCC & Cứu nạn (10 tiêu chí)*: Đầu báo khói quang học kết nối BMS, Sprinkler 68°C tem kiểm định, loa phát thanh khẩn cấp > 75dB, nút ấn báo cháy hành lang, cửa chống cháy 70 phút tay đẩy panic, van ngăn lửa tự động, bình chữa cháy kim xanh, lối thoát nạn thang tăng áp thông thoáng, đèn Exit dạ quang, họng nước vách tường sẵn sàng áp lực.
- **Tiến độ cấp Sổ Hồng qua 5 giai đoạn pháp lý**:
  - Giai đoạn 1: `tiep_nhan_ho_so` (Tiếp nhận hồ sơ hoàn công & biên bản nghiệm thu)
  - Giai đoạn 2: `nop_so_tnmt` (Nộp hồ sơ cấp giấy chứng nhận tại Sở TN&MT)
  - Giai đoạn 3: `tham_dinh_thue` (Thẩm định nghĩa vụ tài chính & thuế trước bạ)
  - Giai đoạn 4: `da_in_phoi_so` (Đã in phôi sổ, ký đóng dấu phôi bằng)
  - Giai đoạn 5: `da_trao_so` (Tổ chức lễ trao sổ hồng chính thức cho cư dân)

### 3.2. Phân Hệ 2: Vận Hành Đô Thị & Dịch Vụ Cư Dân (`modules/operations`)
- **Quản lý hóa đơn dịch vụ định kỳ & Gạch nợ VietQR Pro**:
  - Tự động kết xuất thông báo phí hàng tháng gồm: Phí quản lý diện tích ($S \times \text{Đơn giá}$), Phí gửi xe (ô tô / xe máy), Phí sử dụng điện nước thực tế.
  - Tích hợp cổng thanh toán VietQR Pro 24/7: Cư dân quét mã QR ngân hàng hiển thị đúng số tiền và cú pháp `INV-...`, tiền vào tài khoản Ban quản lý và hệ thống gạch nợ tức thời < 3 giây.
- **Quy trình số hóa cấp phép thi công nội thất (Fit-out Permit)**:
  - Tiếp nhận hồ sơ bản vẽ, danh sách thợ, ngày bắt đầu - kết thúc và mức nộp tiền ký quỹ bảo lãnh thi công (ví dụ 50.000.000 - 100.000.000 VNĐ).
  - Vòng đời: `cho_duyet` $\rightarrow$ `dang_thi_cong` $\rightarrow$ `cho_nghiem_thu` $\rightarrow$ `da_hoan_thanh`.
  - Cơ chế tự động hoàn cọc (Deposit Refund) sau khi nghiệm thu không gây tổn hại kết cấu tòa nhà.
- **Đặt chỗ & Check-in Tiện Ích Nội Khu Đặc Quyền**:
  - Quản lý lịch sử dụng: Sân Pickleball VIP, Khu tiệc nướng BBQ ngoài trời, Hồ bơi vô cực chân mây, Phòng tiệc Cigar & Lounge.
  - Cư dân quét mã QR để lễ tân/bảo vệ check-in tức thì tại sảnh tiện ích.

### 3.3. Phân Hệ 3: Sàn Ký Gửi Thứ Cấp & Co-brokering (`modules/resale`)
- **Quản lý rổ hàng thứ cấp & Hợp đồng độc quyền**:
  - Quản lý giỏ hàng chuyển nhượng và cho thuê với các thông số: Giá chào bán (Asking price), Giá net thu về, Tỷ lệ hoa hồng (1.5% - 2.0%), Tình trạng pháp lý, Chìa khóa xem nhà thực tế.
- **Thuật toán AI Ghép Cặp (AI Matchmaking Engine)**:
  - Điểm tương thích được tính tự động từ 0 đến 100 điểm dựa trên:
    - Loại hình giao dịch (Mua bán vs Thuê): Bắt buộc trùng khớp.
    - Dự án mục tiêu: +35 điểm nếu trùng dự án.
    - Ngân sách giá: +35 điểm nếu giá nằm trong khoảng `[minPrice, maxPrice]`, +20 điểm nếu lệch dưới 10%.
    - Số phòng ngủ: +20 điểm nếu trùng khớp tuyệt đối, +10 điểm nếu chênh 1 phòng.
    - Mức độ cấp bách: +10 điểm nếu khách cần mua gấp trong tuần.
- **Động cơ phân bổ hoa hồng liên kết Co-brokering 50/50**:
  - Khi có môi giới bên ngoài hoặc đại lý F2 dẫn khách chốt cọc: Hệ thống tự động tách hoa hồng thành 2 phần bằng nhau: 50% cho Môi giới niêm yết (Listing Agent) và 50% cho Môi giới đại diện khách mua (Selling Agent).

### 3.4. Phân Hệ 4: Quản Trị Gia Sản VIP & Phân Tích Tài Chính (`modules/portfolio`)
- **Sổ tay tài sản số hóa của Nhà đầu tư VVIP**:
  - Quản lý tập trung toàn bộ danh mục BĐS của khách hàng qua các dự án với các chỉ số tài chính chuyên sâu.
- **Động cơ tính toán tài chính cao cấp**:
  - **Tỷ suất sinh lời nội bộ IRR (Internal Rate of Return)**:
    Sử dụng phương pháp lặp xấp xỉ Newton-Raphson để tìm nghiệm $r$ của phương trình dòng tiền:
    $$\sum_{t=0}^{N} \frac{CF_t}{(1 + r)^t} = 0$$
    Trong đó $CF_0 = -\text{BuyPrice}$, $CF_{1..N-1} = \text{AnnualNetRental}$, và $CF_N = \text{AnnualNetRental} + \text{CurrentValuation}$.
  - **Tốc độ tăng trưởng kép hàng năm CAGR (Compound Annual Growth Rate)**:
    $$\text{CAGR} = \left(\frac{\text{CurrentValuation}}{\text{BuyPrice}}\right)^{\frac{1}{\text{HoldingYears}}} - 1$$
  - **Tỷ suất sinh lời cho thuê ròng (Annual Rental Yield)**:
    $$\text{Rental Yield} = \frac{\text{AnnualNetRental}}{\text{CurrentValuation}} \times 100\%$$
  - **Mô phỏng kịch bản chốt lời tái đầu tư (Exit Scenario Simulation)**:
    Mô phỏng dự phóng giá trị tài sản sau 1, 3, 5 năm với tỷ lệ tăng trưởng kỳ vọng (ví dụ 8.5% - 12%/năm), tính toán tích lũy dòng tiền cho thuê và tổng tỷ suất hoàn vốn ròng (Total Net ROI).

---

## 🗄️ 4. MÔ HÌNH DỮ LIỆU POSTGRESQL 16 (PRISMA SCHEMA)

```prisma
// 1. Hồ sơ nghiệm thu bàn giao
model HandoverTicket {
  id                  String               @id @default(uuid())
  code                String               @unique // HO-2026-001
  contractId          String?
  propertyCode        String
  projectId           String?
  projectName         String
  customerId          String?
  customerName        String
  customerPhone       String?
  customerEmail       String?
  propertyType        String
  area                Float
  scheduledDate       String
  scheduledTime       String?
  assignedEngineer    String?
  status              String               @default("cho_hen")
  electricMeterIndex  Float?
  waterMeterIndex     Float?
  keysHandedOverCount Int                  @default(0)
  accessCardsCount    Int                  @default(0)
  signedDate          String?
  signedByCustomer    Boolean              @default(false)
  signedByStaff       Boolean              @default(false)
  warrantyExpiryDate  String?
  pinkBookStage       String               @default("tiep_nhan_ho_so")
  pinkBookNumber      String?
  defectsCount        Int                  @default(0)
  notes               String?
  checklist           Json?
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt
  defects             SnaggingDefect[]
}

// 2. Lỗi công trình cần sửa chữa
model SnaggingDefect {
  id                  String               @id @default(uuid())
  ticketId            String
  ticket              HandoverTicket       @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  propertyCode        String
  location            String
  category            String
  description         String
  severity            String               @default("Nhe")
  contractor          String
  status              String               @default("Dang Xu Ly")
  reportedDate        String
  photoUrls           Json?
  resolvedDate        String?
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt
}

// 3. Hóa đơn vận hành cư dân
model OperationBill {
  id                  String               @id @default(uuid())
  billCode            String               @unique // INV-2026-0701
  month               String
  propertyCode        String
  projectName         String
  residentName        String
  residentPhone       String?
  managementFee       Decimal              @db.Decimal(15, 2)
  parkingFee          Decimal              @db.Decimal(15, 2)
  utilitiesFee        Decimal              @db.Decimal(15, 2)
  totalAmount         Decimal              @db.Decimal(15, 2)
  status              String               @default("cho_thanh_toan")
  dueDate             String
  paidDate            String?
  paymentMethod       String?
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt
}

// 4. Giấy phép thi công hoàn thiện nội thất
model FitoutPermit {
  id                  String               @id @default(uuid())
  propertyCode        String
  residentName        String
  contractorName      String
  contractorPhone     String?
  workersCount        Int                  @default(1)
  startDate           String
  endDate             String
  depositAmount       Decimal              @db.Decimal(15, 2)
  status              String               @default("cho_duyet")
  depositRefunded     Boolean              @default(false)
  notes               String?
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt
}

// 5. Đặt chỗ tiện ích đô thị
model AmenityBooking {
  id                  String               @id @default(uuid())
  amenityType         String
  propertyCode        String
  residentName        String
  residentPhone       String?
  bookingDate         String
  timeSlot            String
  guestsCount         Int                  @default(1)
  status              String               @default("da_xac_nhan")
  createdAt           DateTime             @default(now())
}

// 6. Rổ hàng thứ cấp & Ký gửi
model ResaleListing {
  id                  String               @id @default(uuid())
  listingCode         String               @unique // KGB-TGM-1502
  type                String               @default("resale")
  projectName         String
  propertyCode        String
  propertyType        String
  ownerName           String
  ownerPhone          String
  area                Float
  bedrooms            Int                  @default(1)
  bathrooms           Int                  @default(1)
  direction           String?
  askingPrice         Decimal              @db.Decimal(15, 2)
  targetNetPrice      Decimal?             @db.Decimal(15, 2)
  commissionRate      Float                @default(1.5)
  commissionAmount    Decimal              @db.Decimal(15, 2)
  legalStatus         String?
  furnishedStatus     String?
  keyStatus           String?
  status              String               @default("active")
  exclusiveContract   Boolean              @default(false)
  exclusiveEndDate    String?
  viewCount           Int                  @default(0)
  showingCount        Int                  @default(0)
  matchedLeadsCount   Int                  @default(0)
  imageUrl            String?
  coBrokerSplitRatio  Float                @default(50.0)
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt
}

// 7. Nhu cầu tìm mua/thuê của khách hàng
model ClientDemand {
  id                  String               @id @default(uuid())
  clientName          String
  clientPhone         String
  demandType          String               @default("resale")
  targetProjects      Json
  minPrice            Decimal              @db.Decimal(15, 2)
  maxPrice            Decimal              @db.Decimal(15, 2)
  bedrooms            Int                  @default(1)
  purpose             String
  urgency             String
  assignedAgent       String
  matchingScore       Float                @default(0)
  suggestedListingCode String?
  createdAt           DateTime             @default(now())
}

// 8. Quản lý danh mục gia sản VIP
model PortfolioAsset {
  id                  String               @id @default(uuid())
  code                String               @unique // NVW-01.01
  title               String
  projectName         String
  projectId           String?
  customerId          String
  customerName        String
  customerPhone       String?
  propertyType        String
  area                Float
  bedrooms            Int                  @default(1)
  bathrooms           Int                  @default(1)
  direction           String?
  view                String?
  buyPrice            Decimal              @db.Decimal(15, 2)
  currentValuation    Decimal              @db.Decimal(15, 2)
  purchaseDate        String
  handoverDate        String
  constructionProgress Int                 @default(100)
  constructionStatus  String
  rentalStatus        String
  monthlyRent         Decimal              @db.Decimal(15, 2)
  tenantName          String?
  leaseEndDate        String?
  annualNetRental     Decimal              @db.Decimal(15, 2)
  contractCode        String
  legalStatus         String
  image               String?
  aiRecommendation    String?
  aiScore             Int                  @default(85)
  irr                 Float?
  cagr                Float?
  rentalYield         Float?
  milestones          Json?
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt
}
```

---

## 🔌 5. DANH MỤC ENDPOINTS RESTFUL & TÍCH HỢP FRONTEND

Tất cả các API được bảo vệ bởi `JwtAuthGuard` & `RolesGuard`. Reverse Proxy tại `next.config.ts` chuyển tiếp `/backend-api/:path*` tới `http://localhost:4000/api/v1/:path*`.

| Phương thức | Endpoint | Chức năng nghiệp vụ |
| :---: | :--- | :--- |
| **GET** | `/api/v1/handover/tickets` | Danh sách hồ sơ nghiệm thu bàn giao |
| **GET** | `/api/v1/handover/checklist-template` | Danh mục 50 tiêu chí kỹ thuật chuẩn ISO |
| **POST** | `/api/v1/handover/tickets` | Khởi tạo hồ sơ bàn giao căn hộ mới |
| **POST** | `/api/v1/handover/defects` | Báo cáo khiếm khuyết lỗi snagging cho nhà thầu |
| **PATCH** | `/api/v1/handover/defects/:id/status` | Cập nhật tiến độ sửa lỗi (Đang xử lý / Đã khắc phục) |
| **PATCH** | `/api/v1/handover/tickets/:id/pink-book` | Cập nhật 5 giai đoạn tiến độ sổ hồng |
| **POST** | `/api/v1/handover/tickets/:id/sign-off` | Ký số biên bản nghiệm thu bàn giao nhà |
| **GET** | `/api/v1/operations/bills` | Danh sách hóa đơn phí quản lý & dịch vụ |
| **POST** | `/api/v1/operations/bills` | Phát hành hóa đơn phí dịch vụ tháng mới |
| **POST** | `/api/v1/operations/bills/:id/pay` | Thanh toán đối soát tức thời qua VietQR Pro 24/7 |
| **GET** | `/api/v1/operations/permits` | Danh sách giấy phép thi công hoàn thiện nội thất |
| **POST** | `/api/v1/operations/permits` | Đăng ký cấp phép thi công & nộp cọc |
| **PATCH** | `/api/v1/operations/permits/:id/status` | Phê duyệt trạng thái thi công nội thất |
| **POST** | `/api/v1/operations/permits/:id/refund` | Nghiệm thu hoàn trả tiền ký quỹ thi công |
| **GET** | `/api/v1/operations/amenities/bookings` | Danh sách đặt chỗ tiện ích Clubhouse nội khu |
| **POST** | `/api/v1/operations/amenities/bookings` | Đăng ký sử dụng tiện ích (Pickleball, BBQ, Pool) |
| **POST** | `/api/v1/operations/amenities/bookings/:id/checkin` | Check-in tiện ích qua mã QR cư dân |
| **GET** | `/api/v1/resale/listings` | Danh mục rổ hàng ký gửi chuyển nhượng & cho thuê |
| **POST** | `/api/v1/resale/listings` | Tiếp nhận sản phẩm ký gửi thứ cấp mới |
| **GET** | `/api/v1/resale/demands` | Danh mục nhu cầu tìm mua/thuê của khách hàng |
| **POST** | `/api/v1/resale/demands` | Đăng ký nhu cầu và tự động chạy AI Matchmaking |
| **POST** | `/api/v1/resale/demands/:id/match-ai` | Thuật toán AI so khớp rổ hàng tối ưu |
| **GET** | `/api/v1/resale/listings/:id/co-broker` | Tính toán tỷ lệ chia hoa hồng Co-brokering 50/50 |
| **POST** | `/api/v1/resale/close-deal` | Chốt cọc giao dịch thứ cấp & ghi nhận hoa hồng |
| **GET** | `/api/v1/portfolio/assets` | Danh mục tài sản tích sản VIP của nhà đầu tư |
| **POST** | `/api/v1/portfolio/assets` | Thêm tài sản mới vào danh mục quản lý gia sản |
| **PATCH** | `/api/v1/portfolio/assets/:id/valuation` | Định giá lại tài sản (Revaluation) & tính lại IRR/CAGR |
| **GET** | `/api/v1/portfolio/summary` | Báo cáo vĩ mô danh mục VIP: Tổng vốn, Định giá, Lãi vốn |
| **POST** | `/api/v1/portfolio/assets/:id/simulate-exit` | Mô phỏng kịch bản chốt lời tái đầu tư (Exit Simulation) |

---

## 🧪 6. KẾT QUẢ KIỂM THỬ PLAYWRIGHT E2E TOÀN DIỆN

Hệ thống được kiểm thử tự động với dữ liệu thực trên Docker PostgreSQL 16 & Redis 7.

### Kết Quả Kiểm Thử Giai Đoạn 4 (`e2e/phase4-operations.spec.ts`):
- `ok  1` Handover: Truy vấn danh sách hồ sơ nghiệm thu bàn giao (20ms)
- `ok  2` Handover: Lấy danh mục 50 tiêu chí kỹ thuật nghiệm thu tiêu chuẩn đại đô thị (11ms)
- `ok  3` Handover: Khởi tạo hồ sơ bàn giao căn hộ mới & ghi nhận lỗi snagging (55ms)
- `ok  4` Handover: Cập nhật tiến độ cấp Sổ Hồng qua 5 giai đoạn pháp lý & Ký số biên bản (44ms)
- `ok  5` Operations: Thu phí dịch vụ quản lý & đối soát VietQR Pro 24/7 (43ms)
- `ok  6` Operations: Luồng phê duyệt giấy phép thi công nội thất & nghiệm thu hoàn cọc (38ms)
- `ok  7` Operations: Đặt chỗ tiện ích Clubhouse & Check-in QR Code cư dân (24ms)
- `ok  8` Resale: Ký gửi rổ hàng thứ cấp & Tính tỷ lệ hoa hồng liên kết Co-brokering 50/50 (19ms)
- `ok  9` Resale: Đăng ký nhu cầu khách hàng & Thuật toán AI Ghép Cặp (AI Matchmaking Engine) (39ms)
- `ok 10` Resale: Chốt cọc giao dịch thứ cấp & ghi nhận chia hoa hồng liên kết (25ms)
- `ok 11` Portfolio: Báo cáo vĩ mô danh mục VIP (Macro Wealth Summary: IRR, CAGR, Yield) (12ms)
- `ok 12` Portfolio: Định giá lại tài sản (Revaluation) & Tự động tính toán lại IRR / CAGR (25ms)
- `ok 13` Portfolio: Mô phỏng kịch bản chốt lời tái đầu tư (Exit Scenario Analysis) (20ms)
- `ok 14` UI Frontend: Tải và tương tác Bàn Giao & Nghiệm Thu Khiếm Khuyết (/handover) (864ms)
- `ok 15` UI Frontend: Tải và tương tác Vận Hành Đô Thị & Dịch Vụ Cư Dân (/operations) (1.1s)
- `ok 16` UI Frontend: Tải và tương tác Sàn Ký Gửi & Thị Trường Thứ Cấp (/resale) (851ms)
- `ok 17` UI Frontend: Tải và tương tác Quản Lý Gia Sản VIP & Danh Mục BĐS (/portfolio) (808ms)

### Kết Quả Toàn Bộ Hệ Thống:
```bash
Running 94 tests using 1 worker
94 passed (31.1s)
```
- `auth-rbac.spec.ts`: 7/7 passed
- `connection.spec.ts`: 4/4 passed
- `docker-real-db.spec.ts`: 10/10 passed
- `phase1-foundation.spec.ts`: 18/18 passed
- `phase2-transactions.spec.ts`: 16/16 passed
- `phase3-proptech.spec.ts`: 22/22 passed
- `phase4-operations.spec.ts`: 17/17 passed
- **Tổng cộng: 94/94 passed (100%)**
