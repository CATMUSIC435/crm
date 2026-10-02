# Phân Hệ Quản Lý Gia Sản & Danh Mục Đầu Tư BĐS VIP - Module `/portfolio`

## 1. Tổng Quan & Tầm Nhìn Chiến Lược Private Wealth Management Trong BĐS Cao Cấp

Trong kỷ nguyên bất động sản hiện đại, các sàn phân phối và tập đoàn địa ốc hàng đầu không còn dừng lại ở vai trò là một đơn vị môi giới bán lẻ từng giao dịch đơn lẻ (Transaction-based Brokerage). Để gắn kết và khai thác tối đa giá trị trọn đời (Customer Lifetime Value - CLV) của tầng lớp khách hàng giàu và siêu giàu (**HNWIs & UHNWIs - High Net Worth Individuals**), doanh nghiệp cần chuyển dịch mô hình sang **Văn phòng quản lý gia sản tư nhân (Private Family Office & Real Estate Wealth Management)**.

Một nhà đầu tư VIP thường sở hữu cùng lúc từ 3 đến 8 bất động sản thuộc nhiều dự án khác nhau (Sky Villa The Grand Manhattan, Biệt thự biển NovaWorld Phan Thiết, Shophouse The Global City, Nhà phố ven sông Aqua City...). Quản lý một danh mục tài sản lớn như vậy mang lại 4 thách thức cốt lõi:
1. **Phân mảnh thông tin & thiếu cái nhìn tổng thể**: Các hợp đồng mua bán, biên bản bàn giao, tiến độ thi công và hợp đồng cho thuê bị lưu trữ rời rạc trên giấy tờ, email hoặc các file Excel cá nhân.
2. **"Mù" định giá thị trường thực tế (Market Valuation Blindspot)**: Nhà đầu tư chỉ nhớ giá mua ban đầu mà không nắm bắt được giá thị trường thứ cấp hiện tại, dẫn đến việc bỏ lỡ điểm rơi chốt lời đỉnh chu kỳ (Peak Cycle Exit).
3. **Áp lực dòng tiền đóng tiền đợt kế tiếp**: Mỗi bất động sản có một tiến độ giải ngân khác nhau (theo móng cọc, cất nóc, bàn giao, nhận sổ hồng). Việc trễ hạn thanh toán có thể dẫn đến phạt lãi suất trả chậm hoặc mất chiết khấu ưu đãi của Chủ Đầu Tư.
4. **Hiệu quả dòng tiền cho thuê (Rental Yield) không được tối ưu**: Nhiều tài sản sau khi nhận nhà bị bỏ trống hoặc cho thuê dưới giá trị thị trường vì thiếu đơn vị vận hành chuyên nghiệp.

Phân hệ **Quản Lý Gia Sản & Danh Mục Đầu Tư BĐS VIP (`/portfolio`)** ra đời như một **Sổ tay tài sản số hóa toàn diện (Digital Real Estate Vault)**, cung cấp báo cáo định giá thị trường thời gian thực, tự động tính toán tỷ suất sinh lời IRR & CAGR, theo dõi lịch thanh toán đợt tới kèm mã VietQR 1-chạm, và tích hợp AI gợi ý chiến lược tái cơ cấu danh mục tài sản tối ưu.

```
+-----------------------------------------------------------------------------------+
|            SỔ TAY QUẢN LÝ GIA SẢN NOVA PRIVATE WEALTH MANAGEMENT (/portfolio)     |
+-----------------------------------------------------------------------------------+
                                          |
          +-------------------------------+-------------------------------+
          |                               |                               |
          v                               v                               v
+-------------------+           +-------------------+           +-------------------+
| TỔNG QUAN TÀI SẢN |           | SỔ TAY SỐ HÓA     |           | LỊCH ĐÓNG TIỀN    |
| & IRR / LÃI VỐN   |           | & PHÁP LÝ HĐMB    |           | & VIETQR 1-CHẠM   |
+-------------------+           +-------------------+           +-------------------+
| - Vốn đầu tư tích lũy         | - Thẻ BĐS số hóa  |           | - Hạn đóng theo đợt|
| - Định giá hôm nay|           | - Mặt bằng 2D & ảnh           | - Cảnh báo đến hạn |
| - Lãi vốn +23.4%  |           | - Tiến độ xây dựng|           | - VietQR NAPAS 247 |
| - Tỷ suất thuê 3.6%           | - Khuyến nghị AI  |           | - Báo cáo PDF VIP |
+-------------------+           +-------------------+           +-------------------+
```

---

## 2. Cấu Trúc Kỹ Thuật & Luồng Dữ Liệu (Technical Architecture)

### 2.1 File Components & Đường Dẫn Mã Nguồn
* **Giao diện quản lý gia sản**: [`app/(dashboard)/portfolio/page.tsx`](file:///c:/Users/catmu/Downloads/crm/app/(dashboard)/portfolio/page.tsx)
* **Tài liệu kỹ thuật module**: [`docs/modules/portfolio.md`](file:///c:/Users/catmu/Downloads/crm/docs/modules/portfolio.md)
* **Kho lưu trữ trạng thái toàn cục**: [`store/useStore.ts`](file:///c:/Users/catmu/Downloads/crm/store/useStore.ts)
* **Khai báo kiểu dữ liệu TypeScript**: [`types/index.ts`](file:///c:/Users/catmu/Downloads/crm/types/index.ts)

### 2.2 Mô Hình Dữ Liệu Thực Thể (Data Models)

#### Entity `PortfolioProperty` (Bất Động Sản Trong Danh Mục Gia Sản)
```typescript
export interface PortfolioProperty {
  id: string;                                   // Định danh duy nhất của tài sản ('port-1')
  code: string;                                 // Mã căn hộ niêm yết ('TGM-28.01', 'NVW-01.01')
  title: string;                                // Tên hiển thị đầy đủ của BĐS
  projectName: string;                          // Tên dự án BĐS
  projectId: string;                            // ID dự án
  customerId: string;                           // ID chủ sở hữu VIP ('c1', 'c4'...)
  customerName: string;                         // Tên khách hàng sở hữu
  customerPhone: string;                        // SĐT liên hệ của chủ sở hữu
  propertyType: string;                         // Loại hình: Biệt thự biển | Sky Villa | Shophouse | Căn hộ
  area: number;                                 // Diện tích sử dụng (m²)
  bedrooms: number;                             // Số phòng ngủ
  bathrooms: number;                            // Số phòng vệ sinh
  direction: string;                            // Hướng cửa chính / ban công
  view: string;                                 // Tầm nhìn cảnh quan (View biển, sông, Bitexco...)
  buyPrice: number;                             // Giá mua vào trên HĐMB (VNĐ)
  currentValuation: number;                     // Định giá thị trường độc lập hiện tại (VNĐ)
  purchaseDate: string;                         // Ngày ký hợp đồng mua
  handoverDate: string;                         // Ngày bàn giao dự kiến hoặc thực tế
  constructionProgress: number;                 // Tiến độ hoàn thiện công trình (0 - 100%)
  constructionStatus: 'Đang móng cọc' | 'Đang xây thô' | 'Đã cất nóc' | 'Đã bàn giao' | 'Đã có sổ hồng';
  rentalStatus: 'Đang cho thuê' | 'Tự khai thác' | 'Đang tìm khách' | 'Chờ nhận nhà';
  monthlyRent: number;                          // Giá thuê hàng tháng (VNĐ)
  tenantName?: string;                          // Tên đơn vị / cá nhân thuê nhà
  leaseEndDate?: string;                        // Thời hạn kết thúc hợp đồng thuê
  annualNetRental: number;                      // Doanh thu cho thuê ròng sau khi trừ 10% chi phí QL (VNĐ)
  contractCode: string;                         // Số hiệu HĐMB (VD: 'HD-921', 'HD-924')
  legalStatus: string;                          // Pháp lý: 'HĐMB công chứng' | 'Sổ hồng lâu dài' | 'HĐ cọc'
  image: string;                                // Ảnh đại diện chất lượng cao của bất động sản
  aiRecommendation: 'Tiếp tục giữ tích sản' | 'Chốt lời tái đầu tư' | 'Tối ưu hóa giá thuê' | 'Cơ cấu danh mục';
  aiScore: number;                              // Điểm số hấp dẫn đầu tư AI (0 - 100)
  nextMilestone?: PortfolioMilestone;           // Đợt đóng tiền tiếp theo (nếu có)
}
```

#### Entity `PortfolioMilestone` (Đợt Đóng Tiền Theo Tiến Độ HĐMB)
```typescript
export interface PortfolioMilestone {
  batch: string;                                // Tên đợt đóng tiền (VD: 'Đợt 5 - Bàn giao nhận nhà')
  percentage: number;                           // Tỷ lệ phần trăm giá trị HĐMB (%)
  amount: number;                               // Số tiền thực tế phải nộp (VNĐ)
  dueDate: string;                              // Ngày đến hạn thanh toán
  status: 'pending' | 'paid' | 'overdue';       // Trạng thái đợt thanh toán
  accountBank: string;                          // Ngân hàng nhận tiền của CĐT
  accountNumber: string;                        // Số tài khoản ngân hàng
  accountName: string;                          // Tên tài khoản thụ hưởng của CĐT
  transferSyntax: string;                       // Cú pháp ủy nhiệm chi chuẩn
  description: string;                          // Diễn giải chi tiết đợt thanh toán
}
```

---

## 3. Mô Hình Tính Toán Chỉ Số Tài Chính Gia Sản (Wealth Formulas & Metrics)

### 3.1 Lãi Vốn Tích Lũy (Capital Gain) & Tỷ Lệ Tăng Trưởng Vốn
Đo lường mức thặng dư tài sản so với số vốn ban đầu nhà đầu tư đã bỏ ra:

$$\text{Tổng Vốn Đầu Tư } (Invested) = \sum_{i=1}^n BuyPrice_i$$

$$\text{Định Giá Thị Trường Hiện Tại } (Valuation) = \sum_{i=1}^n CurrentValuation_i$$

$$\text{Lãi Vốn Tích Lũy } (Capital Gain) = Valuation - Invested$$

$$\text{Tỷ Lệ Tăng Trưởng Vốn } (Gain \%) = \frac{Valuation - Invested}{Invested} \times 100\%$$

---

### 3.2 Dòng Tiền Thuê Ròng Hàng Năm & Tỷ Suất Cho Thuê Gia Quyền (Weighted Rental Yield)
Dòng tiền thụ động sinh ra từ danh mục cho thuê, đã trừ dự phòng hao mòn và phí quản lý:

$$\text{Doanh Thu Thuê Ròng Căn } i = MonthlyRent_i \times 12 \times (1 - 0.10)$$

$$\text{Tổng Dòng Tiền Thuê Ròng Toàn Danh Mục } (Net Rental) = \sum_{i=1}^n \text{Doanh Thu Thuê Ròng Căn } i$$

$$\text{Tỷ Suất Cho Thuê Gia Quyền } (Weighted Rental Yield) = \frac{Net Rental}{Invested} \times 100\%$$

---

### 3.3 Tỷ Suất Sinh Lời Nội Hàm Bình Quân Toàn Danh Mục (Weighted Portfolio IRR)
Chỉ số phản ánh tổng năng lực sinh lời của gia sản, kết hợp giữa lãi vốn tăng giá đất và dòng tiền khai thác (ước tính trên chu kỳ nắm giữ trung bình 3 năm):

$$IRR_{\text{portfolio}} \approx \frac{\text{Gain \%}}{3} + Weighted Rental Yield$$

*Ví dụ thực tế với danh mục toàn sàn*:
* Vốn đầu tư gốc: $129.5$ Tỷ VNĐ.
* Định giá hôm nay: $159.8$ Tỷ VNĐ $\rightarrow$ Lãi vốn $+30.3$ Tỷ VNĐ ($+23.4\%$).
* Lãi vốn bình quân 3 năm: $+7.8\%$/năm.
* Dòng tiền thuê ròng: $4.19$ Tỷ VNĐ/năm $\rightarrow$ Rental Yield $= 3.23\%$/năm.
* **Tổng IRR toàn danh mục đạt: $21.8\%$/năm** (Vượt trội so với lãi suất tiết kiệm ngân hàng $5.5\% - 6.5\%$/năm).

---

### 3.4 Mô Phỏng Lợi Nhuận Ròng Khi Chốt Lời Thoát Hàng (Exit Strategy Net Profit)
Khi nhà đầu tư quyết định bán chuyển nhượng bất động sản ở mức giá mục tiêu ($P_{\text{sell}}$):

$$\text{Lợi Nhuận Gộp } (Gross Gain) = P_{\text{sell}} - BuyPrice$$

$$\text{Thuế TNCN Chuyển Nhượng (2\%)} = P_{\text{sell}} \times 0.02$$

$$\text{Phí Môi Giới Sàn F1/F2 (1.5\%)} = P_{\text{sell}} \times 0.015$$

$$\text{Lợi Nhuận Ròng Thực Nhận } (Net Profit) = Gross Gain - \text{Thuế TNCN} - \text{Phí Môi Giới} - \text{Phí Công Chứng Hành Chính}$$

$$\text{Tỷ Suất Lợi Nhuận Ròng Trên Vốn } (Net ROI) = \frac{Net Profit}{BuyPrice} \times 100\%$$

---

## 4. Hệ Thống 4 Chế Độ Tác Nghiệp (Tabs) Chuyên Sâu

### 4.1 Tab 1: Tổng Quan Danh Mục & Tăng Trưởng Tài Sản
- **Biểu đồ tiến trình tích sản (AreaChart)**: So sánh trực quan chuỗi dữ liệu 2021 đến 2026 giữa Vốn mua vào (Invested) và Định giá thị trường (Valuation).
- **Biểu đồ phân bổ loại hình (PieChart)**: Phân tách tỷ trọng tài sản giữa Biệt thự biển ($35\%$), Sky Villa ($30\%$), Nhà phố thương mại ($25\%$) và Căn hộ cao cấp ($10\%$).
- **Biểu đồ dòng tiền theo quý (BarChart)**: Đo lường doanh thu cho thuê gộp và doanh thu ròng thực nhận qua từng quý.
- **Thẻ đánh giá sức khỏe gia sản (AI Diagnostic)**: Điểm số sức khỏe tài sản đạt **93/100 (Tối ưu)**, chứng minh 100% tài sản sạch pháp lý và đón đầu các cú hích hạ tầng 2026.

### 4.2 Tab 2: Sổ Tay Bất Động Sản Sở Hữu (Digital Asset Cards)
- Hiển thị danh thiếp số hóa cho từng bất động sản với hình ảnh thực tế độ phân giải cao.
- Huy hiệu tiến độ xây dựng: *Đã có sổ hồng, Đã bàn giao, Đã cất nóc (90%), Đang xây thô (75%)*.
- So sánh giá mua vào HĐMB vs Định giá hiện tại kèm tỷ lệ tăng trưởng lãi vốn tích lũy.
- Thanh tiến độ xây dựng trực quan (%) và ngày bàn giao cam kết.
- Tình trạng cho thuê: Tên đơn vị thuê, giá thuê tháng, doanh thu hàng năm.
- Khuyến nghị chiến lược AI: *Tiếp tục giữ tích sản, Chốt lời tái đầu tư, Tối ưu hóa giá thuê, Cơ cấu danh mục*.

### 4.3 Tab 3: Lịch Đóng Tiền Đợt Tới & VietQR 1-Chạm
- Tổng hợp các đợt đóng tiền sắp tới của từng bất động sản theo tiến độ HĐMB.
- Hiển thị tỷ lệ phần trăm đợt đóng, số tiền chính xác, ngày đến hạn thanh toán.
- Nút **"Thanh Toán / Lấy VietQR"**: Mở modal thanh toán hiển thị mã VietQR tiêu chuẩn NAPAS 247, số tài khoản CĐT, cú pháp ủy nhiệm chi chuẩn và nút xác nhận đã chuyển khoản để cập nhật trạng thái `paid`.

### 4.4 Tab 4: Chiến Lược Tái Cơ Cấu & Thoát Hàng AI
- Trí tuệ nhân tạo mổ xẻ chu kỳ tăng trưởng của từng tài sản để đưa ra chỉ dẫn hành động:
  - *Đề xuất 1*: Chốt lời căn Sky Villa The Grand Manhattan (`TGM-28.01`) khi nhận bàn giao Q4/2026 với giá 42 Tỷ (lợi nhuận ròng +8.5 Tỷ) để gom 2 căn Shophouse The Global City khai thác F&B.
  - *Đề xuất 2*: Tái đàm phán hợp đồng ủy thác thuê căn Biệt thự biển NovaWorld (`NVW-01.01`) chuyển đổi sang mô hình Luxury Airbnb để nâng dòng tiền từ 65Tr lên 90Tr/tháng.

---

## 5. Hệ Thống 5 Modals Tương Tác Không Nút Chết (Zero-Dead-Button Modals)

1. **Modal 1: Chi Tiết Thẻ Căn Hộ & Pháp Lý Số Hóa (`selectedPropertyForDetail`)**:
   - Tra cứu đầy đủ thông số kỹ thuật, diện tích tim tường/thông thủy, hướng view, tầng, tháp.
   - Bảng so sánh tài chính: Giá mua HĐMB vs Định giá thị trường.
   - Thư viện tài liệu pháp lý liên kết: Bản scan HĐMB công chứng có dấu đỏ, biên bản nghiệm thu chất lượng công trình kèm nút tải file tức thì.
2. **Modal 2: Thông Báo Đóng Tiền & VietQR 1-Chạm (`selectedMilestoneForPayment`)**:
   - Hiển thị công văn thông báo nộp tiền từ Chủ Đầu Tư.
   - Mã VietQR động NAPAS 247 tạo tự động.
   - Hộp sao chép cú pháp chuyển khoản chính xác để khách hàng dán vào App ngân hàng.
   - Nút **"Xác Nhận Đã Chuyển Khoản"** tự động cập nhật trạng thái đợt thanh toán thành công trong Zustand Store.
3. **Modal 3: Mô Phỏng Chốt Lời / Thoát Hàng BĐS (`showExitModal`)**:
   - Cho phép chọn bất kỳ tài sản nào trong danh mục.
   - Kéo thanh trượt giá bán kỳ vọng ($P_{\text{sell}}$).
   - Tự động bóc tách: Thuế TNCN $2\%$, phí môi giới $1.5\%$, chi phí công chứng, Lợi nhuận ròng (Net Profit) và tỷ suất Net ROI.
4. **Modal 4: Thêm Bất Động Sản Vào Danh Mục VIP (`showAddPropertyModal`)**:
   - Form nhập liệu chuẩn hóa: Chọn khách hàng VIP, chọn dự án, mã căn, giá mua, định giá thị trường, loại hình, diện tích, giá thuê dự kiến.
   - Thêm trực tiếp vào `portfolioProperties` của Zustand Store.
5. **Modal 5: Xuất Báo Cáo Thẩm Định Gia Sản VIP (PDF Memo) (`showWealthReportModal`)**:
   - Khung xem trước báo cáo phân tích tài sản mang chuẩn mực Private Banking Tier.
   - Nút 1-chạm tải về file PDF có dấu mộc thẩm định gia sản.

---

## 6. Ma Trận Kịch Bản Kiểm Thử Nghiệm Thu (8/8 Test Scenarios Matrix)

| Test ID | Kịch Bản Kiểm Thử | Dữ Liệu Đầu Vào | Kết Quả Mong Đợi | Trạng Thái |
| :---: | :--- | :--- | :--- | :---: |
| **TC-01** | Lọc danh mục theo Nhà đầu tư VIP | Chọn khách hàng `Phạm Minh Tuấn` | Dashboard tự lọc đúng 2 BĐS (`TGM-28.01`, `TGC-SH05`), cập nhật tổng vốn 67.0 Tỷ | **PASS** |
| **TC-02** | Xem thẻ chi tiết pháp lý căn hộ | Nhấp "Chi Tiết Pháp Lý" căn `NVW-01.01` | Modal 1 mở ra hiển thị HĐMB số `HD-921`, nút tải scan HĐMB có toast | **PASS** |
| **TC-03** | Thanh toán đợt đóng tiền qua VietQR | Nhấp "Thanh Toán / Lấy VietQR" căn `TGM-28.01` | Modal 2 mở mã VietQR, bấm xác nhận thanh toán chuyển trạng thái sang `paid` | **PASS** |
| **TC-04** | Giả lập chốt lời thoát hàng | Kéo giá bán căn `TGC-SH05` lên 45 Tỷ | Modal 3 tính đúng thuế TNCN 900Tr, phí MG 675Tr, Net Profit +8.4 Tỷ | **PASS** |
| **TC-05** | Thêm BĐS mới vào danh mục | Nhập mã `AQC-PH-202` giá 16.5 Tỷ | Tài sản xuất hiện ngay trên lưới danh mục và cập nhật tổng tài sản | **PASS** |
| **TC-06** | Tìm kiếm nhanh theo từ khóa | Gõ từ khóa `Sky Villa` | Danh sách lập tức chỉ hiển thị căn hộ Sky Villa Manhattan | **PASS** |
| **TC-07** | Xuất sổ tay gia sản CSV | Nhấp nút "Xuất CSV" | Tải file `So_Tay_Gia_San_VIP_*.csv` chuẩn `\uFEFF`, mở Excel không lỗi font | **PASS** |
| **TC-08** | Tải Báo Cáo Thẩm Định Gia Sản PDF | Mở Modal 5 và nhấp "Tải Về PDF" | Kích hoạt hiệu ứng tải báo cáo có dấu mộc Private Tier | **PASS** |

---

## 7. Cẩm Nang Thực Chiến Dành Cho Chuyên Viên Quản Trị Gia Sản (Private Wealth Advisor Playbook)

### Kịch bản 1: Báo Cáo Định Kỳ Hàng Quý Cho Nhà Đầu Tư VIP (Quarterly Wealth Review)
1. **Bước 1**: Mở `/portfolio`, chọn đúng tên nhà đầu tư (VD: Anh Nguyễn Văn Tuấn).
2. **Bước 2**: Trình bày thẻ KPI: Điểm nhấn là mức **Lãi vốn tích lũy $+23.4\%$** và dòng tiền thuê thụ động ổn định hàng tháng.
3. **Bước 3**: Chuyển sang Tab "Lịch Đóng Tiền": Nhắc khéo khách hàng chuẩn bị tài chính cho đợt thanh toán sắp tới, gửi mã VietQR 1-chạm để khách thanh toán đúng hạn tránh lãi phạt.
4. **Bước 4**: Xuất Báo cáo Thẩm định PDF gửi qua Zalo VIP hoặc in bản cứng kẹp bìa da sang trọng trao tận tay khách hàng trong buổi gặp mặt cà phê.

### Kịch bản 2: Tư Vấn Chốt Lời Đỉnh Sóng & Đảo Dòng Tiền Tái Đầu Tư (Capital Rebalancing Pitch)
1. **Bước 1**: Mở Tab "Chiến Lược Tái Cơ Cấu & Thoát Hàng AI".
2. **Bước 2**: Mở Modal "Mô Phỏng Chốt Lời": Chỉ rõ cho khách hàng thấy sau khi trừ hết thuế phí môi giới, khách hàng vẫn bỏ túi **hàng tỷ đồng lợi nhuận ròng**.
3. **Bước 3**: Đề xuất phương án tái cơ cấu: Dùng số tiền chốt lời để thanh toán sớm $95\%$ cho 1 phân khu mới mở bán (VD: The Global City) để nhận chiết khấu khủng $10\% - 12\%$, tiếp tục chu kỳ nhân đôi gia sản.
