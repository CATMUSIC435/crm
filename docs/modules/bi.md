# Phân Hệ Báo Cáo Phân Tích Thông Minh BI (Business Intelligence) - Module `/bi`

## 1. Tổng Quan & Tầm Nhìn Chiến Lược Business Intelligence (BI) Bất Động Sản

Trong mô hình tập đoàn phát triển và tổng đại lý phân phối bất động sản quy mô lớn, Ban lãnh đạo cấp cao (**C-Suite: CEO, CFO, CSO, COO**) đối mặt với lượng dữ liệu khổng lồ phát sinh mỗi ngày: hàng chục ngàn khách hàng tiềm năng đa kênh, hàng ngàn căn hộ thuộc nhiều dự án khác nhau (The Grand Manhattan, Aqua City, The Global City, Vinhomes Grand Park, Novaworld...), hàng trăm tỷ đồng dòng tiền luân chuyển giữa các đợt thanh toán và hàng trăm môi giới tác nghiệp song song.

Nếu chỉ sử dụng các báo cáo Excel tĩnh truyền thống, doanh nghiệp sẽ gặp 3 nguy cơ chí mạng:
1. **Độ trễ thông tin (Data Latency)**: Báo cáo kinh doanh thường trễ từ 3 đến 7 ngày so với diễn biến thực tế tại các sàn giao dịch, khiến lãnh đạo bỏ lỡ thời cơ vàng điều chỉnh rổ hàng hoặc chính sách giá.
2. **"Mù" nút thắt chuyển đổi (Invisible Bottlenecks)**: Biết tổng số lead đổ về và số hợp đồng ký kết, nhưng không định lượng được khách hàng đang rơi rụng nhiều nhất ở khâu nào (sau khi xem sa bàn, sau khi đặt cọc thiện chí hay do ngân hàng chậm giải ngân).
3. **Thiếu năng lực dự báo tương lai (No Predictive Capability)**: Chỉ nhìn thấy những gì đã diễn ra trong quá khứ mà không có mô hình toán học dự báo xu hướng doanh thu và điểm bùng nổ dòng tiền trong 3 đến 6 tháng tới.

Phân hệ **Báo Cáo Phân Tích Thông Minh BI (`/bi`)** được xây dựng như một **Executive Cockpit (Khoang lái điều hành trung tâm)**, trang bị trí tuệ nhân tạo (AI Data Analyst) và mô hình chuỗi thời gian ARIMA nhằm chuyển hóa Big Data thành các chỉ dẫn chiến lược hành động tức thì.

```
+-----------------------------------------------------------------------------------+
|               KHOANG LÁI ĐIỀU HÀNH THÔNG MINH BI NOVAEXECUTIVE (/bi)              |
+-----------------------------------------------------------------------------------+
                                          |
          +-------------------------------+-------------------------------+
          |                               |                               |
          v                               v                               v
+-------------------+           +-------------------+           +-------------------+
| DỰ BÁO DOANH THU  |           | PHỄU BÁN HÀNG     |           | DÒNG TIỀN THỰC THU|
| ARIMA & WHAT-IF   |           | & GIẢI MÃ NÚT THẮT|           | & TỒN KHO DỰ ÁN   |
+-------------------+           +-------------------+           +-------------------+
| - 12 Tháng Actual |           | - 6 Giai đoạn phễu|           | - Thực thu vs KH  |
| - AI Forecast Q3  |           | - Tỷ lệ rơi rụng %|           | - Hấp thụ giỏ hàng|
| - Biên độ 95% tin cậy         | - Tốc độ 14.2 ngày|           | - Stock-out ETA   |
| - What-If Sliders |           | - SLA 15p gọi lại |           | - Cảnh báo hàng ế |
+-------------------+           +-------------------+           +-------------------+
```

---

## 2. Cấu Trúc Kỹ Thuật & Luồng Dữ Liệu (Technical Architecture)

### 2.1 File Components & Đường Dẫn
* **Giao diện điều khiển trung tâm**: [`app/(dashboard)/bi/page.tsx`](file:///c:/Users/catmu/Downloads/crm/app/(dashboard)/bi/page.tsx)
* **Tài liệu kỹ thuật module**: [`docs/modules/bi.md`](file:///c:/Users/catmu/Downloads/crm/docs/modules/bi.md)
* **Kho lưu trữ trạng thái toàn cục**: [`store/useStore.ts`](file:///c:/Users/catmu/Downloads/crm/store/useStore.ts)
* **Khai báo kiểu dữ liệu TypeScript**: [`types/index.ts`](file:///c:/Users/catmu/Downloads/crm/types/index.ts)

### 2.2 Mô Hình Dữ Liệu Thực Thể (Data Models)

#### Entity `HeatmapData` (Ma Trận Lưu Lượng Tương Tác)
```typescript
export interface HeatmapData {
  day: string;                                  // Thứ trong tuần: 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'
  hour: string;                                 // Khung giờ: '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'
  value: number;                                // Điểm số lưu lượng tương tác (0 - 100)
}
```

#### Entity `Contract` (Được tổng hợp thành chỉ số Doanh thu & Dòng tiền)
```typescript
export interface Contract {
  id: string;                                   // Mã hợp đồng
  code: string;                                 // Số hiệu HĐMB (VD: 'HDMB-TGM-08.02')
  customerName: string;                         // Tên khách hàng ký kết
  projectName: string;                          // Tên dự án BĐS
  unitCode: string;                             // Mã căn hộ
  value: number;                                // Tổng giá trị hợp đồng (VNĐ)
  paidAmount?: number;                          // Số tiền thực tế đã thu vào tài khoản (VNĐ)
  status: 'draft' | 'pending' | 'signed' | 'completed' | 'cancelled';
  date: string;                                 // Ngày ký hợp đồng
  paymentMethod?: string;                       // Phương thức: Vay ngân hàng | Chuẩn | Sớm 70%
}
```

---

## 3. Mô Hình Dự Báo Doanh Thu ARIMA & Trình Giả Lập What-If (Growth Simulator)

### 3.1 Mô Hình Chuỗi Thời Gian ARIMA (Autoregressive Integrated Moving Average)
Hệ thống sử dụng mô hình dự báo chuỗi thời gian ARIMA $(p, d, q)$ để ngoại suy doanh thu 12 tháng:
* **Chuỗi thực tế ($T1 \rightarrow T7/2026$)**: Tổng hợp tự động từ giá trị các hợp đồng mua bán chính thức đã ký trong kho lưu trữ dữ liệu CRM.
* **Chuỗi dự phóng ($T8 \rightarrow T12/2026$)**: Mô hình AI tính toán dựa trên chu kỳ mở bán quá khứ, lượng booking tồn đọng và xu hướng thị trường lãi suất:

$$\hat{Y}_t = \mu + \sum_{i=1}^p \phi_i Y_{t-i} - \sum_{j=1}^q \theta_j \epsilon_{t-j} + \epsilon_t$$

* **Dải biên độ tin cậy 95% (Confidence Interval)**:
  * *Biên trên (Upper Bound)*: Phản ánh kịch bản thị trường hưng phấn, giải ngân ngân hàng thông suốt.
  * *Biên dưới (Lower Bound)*: Phản ánh kịch bản siết tín dụng hoặc pháp lý dự án kéo dài.

### 3.2 Cơ Chế Mô Phỏng Kịch Bản Tăng Trưởng AI (What-If Simulation Engine)
Ban Giám Đốc có thể trực tiếp điều chỉnh 3 thanh trượt tham số kinh doanh trong Modal **Mô Phỏng What-If**:
1. **$\Delta \text{MKT}$**: Tăng/giảm ngân sách Marketing chạy Ads ($-30\%$ đến $+100\%$).
2. **$\text{Discount Rate}$**: Chính sách chiết khấu kích cầu mở bán thêm ($0\%$ đến $12\%$).
3. **$\Delta \text{Headcount}$**: Mở rộng quy mô đội ngũ Sales chiến binh ($0$ đến $+50$ nhân sự).

Công thức dự phóng doanh thu mới tức thì:

$$\text{Doanh Thu Mới} = \text{Doanh Thu Cơ Sở} \times \left( 1 + 0.4 \times \frac{\Delta \text{MKT}}{100} + 0.8 \times \frac{\text{Discount Rate}}{100} + 1.5 \times \frac{\Delta \text{Headcount}}{100} \right)$$

$$\text{Số Lượng Deals Mới} = \text{Deals Cơ Sở} \times \left( 1 + 0.35 \times \frac{\Delta \text{MKT}}{100} + 0.9 \times \frac{\text{Discount Rate}}{100} + 1.8 \times \frac{\Delta \text{Headcount}}{100} \right)$$

---

## 4. Phễu Bán Hàng Bất Động Sản 6 Giai Đoạn & Phân Tích Nút Thắt (Bottlenecks)

Phễu bán hàng BĐS được chuẩn hóa thành 6 nấc thang chuyển đổi thực tế:

| Giai Đoạn Phễu | Số Lượng (Leads) | Tỷ Lệ Tích Lũy | Tỷ Lệ Rơi Rụng | Thời Gian Trung Bình | Điểm Nghẽn / Nút Thắt Chính |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **1. Inbound Leads** | 1,850 | 100% | 0% | 0 ngày | Chất lượng lead từ một số kênh Ads TikTok còn loãng |
| **2. Tương Tác Sâu** | 1,120 | 60.5% | -39.5% | 1.5 ngày | Chuyên viên chậm gọi lại sau 15 phút đầu |
| **3. Xem Showroom / Sa Bàn** | 640 | 34.6% | -42.8% | 3.2 ngày | Khách e ngại hạ tầng đường ven sông chưa thi công |
| **4. Đặt Booking Thiện Chí** | 280 | 15.1% | -56.2% | 4.8 ngày | Tâm lý chờ đợi chính sách mở bán chính thức |
| **5. Chốt Cọc Chính Thức** | 145 | 7.8% | -48.2% | 2.1 ngày | Thủ tục chứng minh thu nhập vay Vietcombank kéo dài |
| **6. Ký HĐMB Thành Công** | 98 | 5.3% | -32.4% | 5.6 ngày | Thu xếp vốn tự có nộp 15% đợt đầu |

### 4.1 Vận Tốc Phễu (Sales Velocity)
$$\text{Vận Tốc Phễu} = \frac{\text{Số lượng Deals} \times \text{Giá trị trung bình mỗi Deal} \times \text{Tỷ lệ chốt}}{\text{Thời gian chu kỳ bán hàng (ngày)}} = 14.2 \text{ ngày / giao dịch}$$

---

## 5. Dòng Tiền Thu Đợt & Ma Trận Hấp Thụ Giỏ Hàng (Cash Flow & Inventory Matrix)

### 5.1 Kế Hoạch Thu Dòng Tiền (Cash Inflow Schedule)
Theo dõi so sánh song song giữa **Dòng tiền thực thu (Actual Inflow)** và **Kế hoạch thu phải đòi (Planned Inflow)**:
* **Tháng 7/2026**: Thực thu đạt **78.2 Tỷ VNĐ** trên kế hoạch 75.0 Tỷ VNĐ (Vượt 104.2%).
* **Công nợ tồn đọng (Accounts Receivable)**: **8.4 Tỷ VNĐ** — chủ yếu chờ ngân hàng đối tác hoàn tất giải ngân gói tín dụng sau khi phát hành thư bảo lãnh.

### 5.2 Tỷ Lệ Hấp Thụ Giỏ Hàng (Inventory Absorption Rate)
Đo lường năng lực hấp thụ của thị trường đối với từng đại dự án:

$$\text{Tỷ Lệ Hấp Thụ (\%)} = \left( \frac{\text{Số căn Đã Bán} + \text{Số căn Đang Booking}}{\text{Tổng số căn trong giỏ hàng}} \right) \times 100\%$$

* **The Grand Manhattan (Quận 1)**: Hấp thụ **88%** (Còn 12 căn / 100 căn) $\rightarrow$ Dự kiến cháy hàng trong **1.5 tháng**.
* **Aqua City (Đồng Nai)**: Hấp thụ **75%** (Còn 85 căn / 340 căn) $\rightarrow$ Dự kiến cháy hàng trong **4.0 tháng**.
* **The Global City (Thủ Đức)**: Hấp thụ **68%** (Còn 45 căn / 140 căn) $\rightarrow$ Dự kiến cháy hàng trong **3.5 tháng**.
* **Cảnh báo hàng ế ẩm (>90 ngày)**: Phát hiện 4 căn Penthouse diện tích lớn có thời gian lưu kho vượt ngưỡng 90 ngày $\rightarrow$ Kiến nghị kích hoạt gói chiết khấu đặc cách **Flash Deal 3%**.

---

## 6. Bản Đồ Nhiệt Tương Tác Khách Hàng (Customer Activity Heatmap) & Khung Giờ Vàng

Bản đồ nhiệt được xây dựng trên ma trận **7 ngày trong tuần** $\times$ **7 mốc giờ vàng** (`08:00`, `10:00`, `12:00`, `14:00`, `16:00`, `18:00`, `20:00`):

1. **Khung Giờ Vàng Telesale Khách Nét**:
   * **09:30 - 11:30** và **15:30 - 17:30** từ Thứ Ba đến Thứ Sáu.
   * Tỷ lệ bắt máy thành công đạt **78%**, khách hàng có thời gian lắng nghe tư vấn sâu.
2. **Khung Giờ Vàng Đón Khách Xem Sa Bàn & Nhà Mẫu**:
   * **Thứ Bảy & Chủ Nhật (09:00 - 16:00)**: Lưu lượng khách check-in tăng vọt gấp **3.2 lần** ngày thường.
   * Đề xuất: Phân công tối thiểu 12 chuyên viên và 2 chuyên viên tín dụng túc trực tại Showroom.
3. **Khung Giờ Vàng Chạy Quảng Cáo Chuyển Đổi (Ads Conversion Window)**:
   * **20:00 - 23:00 hàng đêm**: Thời điểm khách hàng thảnh thơi lướt Facebook/TikTok/Zalo tại nhà.
   * Chi phí trên mỗi lead (CPL) giảm **35%**, tỷ lệ để lại số điện thoại tăng gấp đôi.

---

## 7. Các Hộp Thoại Tương Tác & Tính Năng Xuất Dữ Liệu (Modals & Export)

Phân hệ đảm bảo nguyên tắc **100% Zero Dead Buttons** với đầy đủ 5 Modal chức năng:

1. **Modal Bộ Lọc Phân Tích Đa Chiều (`showFilterModal`)**: Lọc theo Dự án, Chu kỳ thời gian (Tháng 7, Quý 3, 6 tháng, Cả năm), và Phân khúc BĐS.
2. **Modal Mô Phỏng Kịch Bản Tăng Trưởng What-If (`showWhatIfModal`)**: 3 thanh trượt tương tác trực tiếp cập nhật Doanh số dự phóng mới và số HĐMB chốt mới theo thời gian thực.
3. **Modal Kế Hoạch Tháo Gỡ Nút Thắt Phễu Bán Hàng (`showBottleneckModal`)**: Trình bày 3 giải pháp cấp bách (cấp chứng thư bảo lãnh 48h, bổ sung kính VR360, siết kỷ luật cuộc gọi 15 phút).
4. **Modal Lịch Trình Dòng Tiền & Thu Công Nợ (`showCashflowDetailModal`)**: Bảng theo dõi các khoản thu tiền đợt HĐMB chuẩn bị đáo hạn trong 60 ngày tới.
5. **Modal Chi Tiết Ô Nhiệt Heatmap (`selectedHeatmapCell`)**: Xem cơ cấu số cuộc gọi, tin nhắn Zalo OA và lượt khách ghé thăm tại khung giờ được click.
6. **Nút Xuất Báo Cáo CSV (`handleExportCSV`)**: Xuất toàn bộ bảng số liệu phân tích điều hành BI chuẩn **UTF-8 BOM**, mở tiếng Việt hoàn hảo trên Microsoft Excel.

---

## 8. Hướng Dẫn Vận Hành & Khuyến Nghị Thực Tiễn Dành Cho Lãnh Đạo

1. **Giao ban đầu tuần cùng Khoang Lái BI**:
   * Tổng Giám Đốc và các Giám Đốc Khối mở tab *Tổng Quan & Dự Báo ARIMA* để so sánh tiến độ thực tế với kịch bản mục tiêu quý.
2. **Khai thác triệt để Trình mô phỏng What-If**:
   * Trước khi quyết định tăng ngân sách Marketing cho một phân khu mới, chạy thử kịch bản What-If để tính toán trước ROI và số lượng nhân sự sale cần bổ sung tương ứng.
3. **Rà soát định kỳ rổ hàng tồn kho**:
   * Kiểm tra tab *Dòng Tiền & Tồn Kho Dự Án* vào ngày 25 hàng tháng. Những căn hộ có thời gian tồn kho trên 60 ngày cần được chuyển giao cho đội ngũ chuyên biệt phân phối kèm chính sách thưởng nóng.
