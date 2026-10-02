# Phân Hệ Khảo Sát Khách Hàng & Đo Lường Chỉ Số Hài Lòng NPS - Module `/surveys`

## 1. Tổng Quan & Tầm Nhìn Chiến Lược Quản Trị Trải Nghiệm Khách Hàng (CX) Bất Động Sản

Trong lĩnh vực phân phối bất động sản trung và cao cấp (với giá trị giao dịch từ 5 tỷ đến hơn 50 tỷ VNĐ mỗi sản phẩm), **Trải nghiệm khách hàng (Customer Experience - CX)** đóng vai trò quyết định đến 60% quyết định mua lại (Re-purchase) và tỷ lệ giới thiệu khách hàng mới qua truyền miệng (Referral Word-of-Mouth). Một trải nghiệm tư vấn xuất sắc hoặc quy trình giải ngân ngân hàng suôn sẻ có thể biến một nhà đầu tư cá nhân thành "Đại sứ thương hiệu", mang về hàng chục giao dịch tiếp theo mà không tốn chi phí quảng cáo (Zero CAC). Ngược lại, một sự cố không được xử lý (như chậm trễ bảo hành nẹp cửa hoặc nhân viên tổng đài không bắt máy) có thể nhanh chóng biến thành khủng hoảng truyền thông trên các diễn đàn mạng xã hội.

Phân hệ **Khảo Sát Khách Hàng & Chỉ Số Hài Lòng NPS (`/surveys`)** được thiết kế nhằm mục tiêu:
1. **Đo lường thời gian thực (Real-time Live Metrics)** tam giác chỉ số cốt lõi: **NPS** (Net Promoter Score), **CSAT** (Customer Satisfaction Score) và **CES** (Customer Effort Score).
2. **Phân tích cảm xúc ngôn ngữ tự nhiên (AI NLP Sentiment Analysis)**: Tự động trích xuất cụm từ khóa tích cực, trung tính và tiêu cực từ hàng trăm phản hồi thô của khách hàng.
3. **Quy trình phản ứng nhanh xử lý khiếu nại (Red Alert SLA 24h)**: Tự động phát hiện phản hồi tiêu cực (1-2 sao), kích hoạt chuông cảnh báo và phân bổ chuyên viên CSKH lập biên bản khắc phục sự cố trong vòng 24 giờ.
4. **Tự động hóa kịch bản khảo sát đa kênh (Trigger-based Multi-channel Survey)**: Tích hợp sâu vào hành trình khách hàng (sau check-in xem sa bàn, sau khi ký cọc, sau giải ngân đợt 1 và sau khi bàn giao căn hộ thực tế) qua Zalo ZNS, SMS Brandname, Email và App Cư dân.
5. **Cơ chế gắn thưởng điểm Loyalty (Incentive Gamification)**: Tặng ngay từ 200 đến 1,000 Điểm Thưởng Khách Hàng Thân Thiết sau khi hoàn tất khảo sát, nâng tỷ lệ phản hồi điền form lên tới **71.5%**.

```
+-----------------------------------------------------------------------------------+
|               HỆ THỐNG ĐO LƯỜNG TRẢI NGHIỆM KHÁCH HÀNG CRM (/surveys)             |
+-----------------------------------------------------------------------------------+
                                          |
          +-------------------------------+-------------------------------+
          |                               |                               |
          v                               v                               v
+-------------------+           +-------------------+           +-------------------+
| THU THẬP ĐA KÊNH  |           | AI NLP SENTIMENT  |           | TRIAGE & XỬ LÝ    |
| & TRIGGER TỰ ĐỘNG |           | & LIVE METRICS    |           | KHIẾU NẠI SLA 24H |
+-------------------+           +-------------------+           +-------------------+
| - Zalo ZNS (92%)  |           | - CSAT: % 4-5 sao |           | - Cảnh báo đỏ 1-2*|
| - Post-Sale Form  |           | - NPS: Promo-Detr |           | - Phân công CSKH  |
| - Google Reviews  |           | - CES: Độ dễ dàng |           | - Khắc phục sự cố |
| - Showroom Kiosk  |           | - NLP Word Cloud  |           | - Tặng quà tri ân |
| - SMS/App Push    |           | - Trendline 6th   |           | - Bảo vệ danh tiếng|
+-------------------+           +-------------------+           +-------------------+
```

---

## 2. Cấu Trúc Kỹ Thuật & Luồng Dữ Liệu (Technical Architecture)

### 2.1 File Components & Đường Dẫn
* **Giao diện điều khiển trung tâm**: [`app/(dashboard)/surveys/page.tsx`](file:///c:/Users/catmu/Downloads/crm/app/(dashboard)/surveys/page.tsx)
* **Tài liệu kỹ thuật module**: [`docs/modules/surveys.md`](file:///c:/Users/catmu/Downloads/crm/docs/modules/surveys.md)
* **Kho lưu trữ trạng thái toàn cục**: [`store/useStore.ts`](file:///c:/Users/catmu/Downloads/crm/store/useStore.ts)
* **Khai báo kiểu dữ liệu TypeScript**: [`types/index.ts`](file:///c:/Users/catmu/Downloads/crm/types/index.ts)

### 2.2 Mô Hình Dữ Liệu Thực Thể (Data Models)

#### Entity `Review` (Đánh Giá & Phản Hồi Khách Hàng)
```typescript
export interface Review {
  id: string;                                   // Mã định danh phản hồi (r1, r2,...)
  customerId: string;                           // Liên kết tới bảng Customer
  customerName: string;                         // Họ tên khách hàng
  phone?: string;                               // Số điện thoại liên hệ
  projectName?: string;                         // Dự án BĐS liên quan
  rating: number;                               // Thang điểm sao CSAT (1 - 5 sao)
  npsScore?: number;                            // Thang điểm NPS (0 - 10 điểm)
  cesScore?: number;                            // Thang điểm nỗ lực khách hàng CES (1 - 7 điểm)
  source: string;                               // Nguồn kênh thu thập
  channel?: 'Zalo ZNS' | 'Google Review' | 'Post-Sale Form' | 'Showroom Kiosk' | 'SMS Link' | string;
  text: string;                                 // Nội dung nhận xét/góp ý của khách
  date: string;                                 // Ngày ghi nhận đánh giá (YYYY-MM-DD)
  sentiment: 'positive' | 'neutral' | 'negative'; // Phân loại cảm xúc tự động bởi AI NLP
  resolutionStatus?: 'pending' | 'resolved' | 'escalated'; // Trạng thái xử lý khiếu nại
  resolutionNotes?: string;                     // Biên bản/Ghi chú phương án giải quyết
  assignedStaff?: string;                       // Chuyên viên CSKH phụ trách xử lý
}
```

#### Entity `SurveyCampaign` (Chiến Dịch Khảo Sát Tự Động Hóa)
```typescript
export interface SurveyCampaign {
  id: string;                                   // Mã chiến dịch khảo sát (sc1, sc2,...)
  name: string;                                 // Tên chiến dịch
  trigger: string;                              // Kịch bản điều kiện kích hoạt
  responses: number;                            // Số lượng phản hồi đã thu về
  conversion: string;                           // Tỷ lệ hoàn thành điền form (VD: '71.5%')
  status?: 'active' | 'paused';                 // Trạng thái vận hành
  channel?: string;                             // Kênh phân phối chính (Zalo ZNS, SMS, Email, App)
  targetAudience?: string;                      // Nhóm đối tượng nhận khảo sát
  rewardPoints?: number;                        // Số điểm thưởng Loyalty tặng kèm (VD: 200, 500)
  createdAt?: string;                           // Ngày khởi tạo chiến dịch
  csatScore?: number;                           // Chỉ số CSAT trung bình của chiến dịch
  npsScore?: number;                            // Chỉ số NPS của chiến dịch
  formUrl?: string;                             // Đường dẫn form khảo sát trực tuyến
}
```

---

## 3. Các Công Thức Toán Học Đo Lường Trải Nghiệm Khách Hàng (CX Metrics Formulation)

Hệ thống tính toán hoàn toàn tự động và cập nhật tức thì (Live Recalculation) mỗi khi có phản hồi mới từ khách hàng hoặc khi chạy công cụ Giả lập đánh giá:

### 3.1 Chỉ Số Hài Lòng Khách Hàng (Customer Satisfaction Score - CSAT)
Đo lường mức độ hài lòng về chất lượng tư vấn, thái độ nhân viên hoặc tiện ích dự án theo thang đo 1 đến 5 sao:

$$\text{CSAT (\%)} = \left( \frac{\text{Số lượng đánh giá đạt 4 sao hoặc 5 sao}}{\text{Tổng số lượng đánh giá tiếp nhận}} \right) \times 100\%$$

* **Ngưỡng Xuất Sắc**: $\ge 85\%$
* **Ngưỡng An Toàn**: $75\% - 84\%$
* **Ngưỡng Báo Động**: $< 75\%$ (Bắt buộc rà soát lại thái độ phục vụ của đại lý và chuyên viên)

### 3.2 Chỉ Số Đo Lường Sự Trung Thành & Giới Thiệu (Net Promoter Score - NPS)
Dựa trên tiêu chuẩn quốc tế của Bain & Company, đo lường khả năng khách hàng giới thiệu dự án cho bạn bè, người thân theo thang điểm từ **0 đến 10**:

* **Nhóm Ủng Hộ (Promoters)**: Chấm 9 - 10 điểm (hoặc 5 sao). Đây là những khách hàng cực kỳ hào hứng, sẵn sàng tái đầu tư và giới thiệu người thân.
* **Nhóm Thụ Động (Passives)**: Chấm 7 - 8 điểm (hoặc 4 sao). Khách hàng hài lòng ở mức vừa phải nhưng dễ bị đối thủ cạnh tranh lôi kéo bằng chiết khấu hấp dẫn hơn.
* **Nhóm Chê Bai / Bất Mãn (Detractors)**: Chấm 0 - 6 điểm (hoặc 1 - 3 sao). Khách hàng gặp bức xúc, có nguy cơ lan truyền thông tin bất lợi.

$$\text{Tỷ lệ Promoters (\%)} = \left( \frac{\text{Số lượng Promoters}}{\text{Tổng số phản hồi}} \right) \times 100\%$$

$$\text{Tỷ lệ Detractors (\%)} = \left( \frac{\text{Số lượng Detractors}}{\text{Tổng số phản hồi}} \right) \times 100\%$$

$$\text{Điểm NPS} = \text{\% Promoters} - \text{\% Detractors} \quad (\text{Biên độ từ } -100 \text{ đến } +100)$$

* **NPS > +50**: Cấp độ Xuất Sắc (World-Class Experience) - Khách hàng tự nguyện trở thành kênh bán hàng lan tỏa.
* **NPS từ +20 đến +49**: Cấp độ Tốt (Strong Foundation) - Đạt chuẩn cạnh tranh cao của thị trường BĐS.
* **NPS < 0**: Tình trạng Báo động Đỏ - Nguy cơ suy giảm doanh số mở bán do phản ứng tiêu cực.

### 3.3 Chỉ Số Nỗ Lực Của Khách Hàng (Customer Effort Score - CES)
Đo lường mức độ thuận tiện và nhẹ nhàng khi khách hàng thực hiện các thủ tục giấy tờ phức tạp (ký thỏa thuận đặt cọc, chuẩn bị hồ sơ vay ngân hàng, giải ngân vốn, nhận bàn giao sổ hồng) theo thang điểm từ **1 (Rất Khó Khăn)** đến **7 (Rất Nhanh Gọn & Dễ Dàng)**:

$$\text{Điểm CES Trung Bình} = \frac{\sum_{i=1}^{N} \text{Điểm } \text{CES}_i}{N} \quad (\text{Thang điểm } 1.0 - 7.0)$$

* **Mục tiêu đạt được**: $\ge 5.8 / 7.0$ (Đảm bảo tối giản thủ tục hành chính, số hóa hồ sơ giao dịch).

---

## 4. Phân Tích Cảm Xúc Ngôn Ngữ Tự Nhiên (AI NLP Sentiment Pipeline) & SLA 24h

Hệ thống ứng dụng thuật toán phân loại cảm xúc tự động (NLP Sentiment Classification) để phân loại từng dòng phản hồi vào 3 nhóm:

```
[Phản Hồi Thô Của Khách Hàng]
              |
              v
[Bộ Lọc Từ Điển Thuật Ngữ BĐS & Tokenizer NLP]
              |
     +--------+--------+
     |                 |
(Điểm >= 4*)      (Điểm <= 2*)
     |                 |
     v                 v
[TÍCH CỰC (Positive)] [TIÊU CỰC (Negative)]
- Trích xuất lời khen  - Kích hoạt CẢNH BÁO ĐỎ
- Ghi nhận KPI Sale    - Đẩy vào hàng đợi SLA 24h
- Đưa vào Testimonial  - Gán CSKH phụ trách xử lý
```

### 4.1 Bản Đồ Từ Khóa NLP (Keyword Sentiment Cloud)
Hệ thống tự động gom nhóm tần suất các cụm từ xuất hiện nhiều nhất:
* **Cụm từ Tích cực nổi trội**: *"Tư vấn nhiệt tình"* (48 lần), *"Thủ tục cọc nhanh gọn"* (36 lần), *"Sa bàn ảo 3D đẹp"* (31 lần), *"Duyệt vay Vietcombank siêu tốc"* (24 lần), *"Nhạc nước Global City đỉnh"* (18 lần).
* **Cụm từ Cần cải thiện (Trung tính)**: *"Đường vào Hương Lộ 2 đang thi công"* (12 lần), *"Phí đỗ xe ô tô hầm cao"* (8 lần).
* **Cụm từ Cảnh báo (Tiêu cực)**: *"Hotline bận máy giờ trưa"* (7 lần), *"Bảo hành nẹp cửa chậm"* (5 lần).

### 4.2 Quy Trình Xử Lý Khiếu Nại Chuẩn SLA 24h (Complaint Resolution SOP)
Khi một phản hồi bị chấm 1 - 2 sao hoặc có cảm xúc `negative`:
1. **Phát Hiện & Cảnh Báo (T0 - 5 phút)**: Hệ thống tự động đánh dấu cờ `resolutionStatus = 'pending'`, hiển thị biểu tượng nhấp nháy đỏ trên tab Sổ Phản Hồi và tính vào chỉ số Cảnh Báo Dịch Vụ.
2. **Tiếp Nhận & Phân Bổ (T0 + 2 giờ)**: Trưởng phòng CSKH chỉ định chuyên viên phụ trách (assignedStaff) rà soát lịch sử giao dịch của khách trên CRM.
3. **Liên Hệ Trực Tiếp & Lập Biên Bản (T0 + 12 giờ)**: Chuyên viên gọi điện xin lỗi chân thành, lắng nghe bức xúc và đưa ra giải pháp khắc phục cụ thể (hẹn đốc công xuống nhà kiểm tra, ưu tiên xử lý hồ sơ ngân hàng trong ngày).
4. **Đóng Hồ Sơ & Tri Ân (T0 + 24 giờ)**: Ghi nhận giải pháp vào hệ thống qua Modal **Xử Lý Khiếu Nại (SLA 24h)**, tặng kèm Voucher nghỉ dưỡng hoặc điểm Loyalty xoa dịu, chuyển trạng thái sang `resolved`.

---

## 5. Danh Mục Kịch Bản Khảo Sát Tự Động (Trigger-Based Automation)

| Mã Chiến Dịch | Tên Kịch Bản Khảo Sát | Kênh Phân Phối | Điều Kiện Kích Hoạt Tự Động (Trigger Logic) | Tỷ Lệ Điền Form | Điểm Thưởng Trao Tặng |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **`sc1`** | **Khảo Sát Tức Thì Sau Tham Quan Sa Bàn & Nhà Mẫu** | Zalo ZNS | Tự động gửi Zalo sau khi khách Check-in sự kiện hoặc Showroom 1 giờ | **46.8%** | +200 Loyalty Pts |
| **`sc2`** | **Đánh Giá Chất Lượng Tư Vấn Của Chuyên Viên Sale** | SMS & Email | Kích hoạt ngay khi khách hàng hoàn tất Ký Thỏa Thuận Đặt Cọc | **71.5%** | +500 Loyalty Pts |
| **`sc3`** | **Khảo Sát Thủ Tục Thẩm Định Hồ Sơ Vay Ngân Hàng** | Zalo ZNS | Gửi khi Ngân hàng đối tác phát hành Thư bảo lãnh cấp tín dụng đợt 1 | **52.0%** | +300 Loyalty Pts |
| **`sc4`** | **Khảo Sát Nghiệm Thu & Nhận Bàn Giao Chìa Khóa Nhà** | App Cư Dân | Hiển thị pop-up khi ký Biên bản Bàn giao căn hộ thực tế | **83.3%** | +1,000 Loyalty Pts |
| **`sc5`** | **Khảo Sát Đo Lường NPS Định Kỳ Cư Dân 6 Tháng** | Zalo OA Broadcast | Gửi tự động hàng loạt vào ngày 15 của tháng 6 và tháng 12 hàng năm | **39.2%** | +500 Loyalty Pts |

---

## 6. Trình Thiết Kế & Xem Trước Form Khảo Sát Mobile (Interactive Survey Builder)

Module `/surveys` tích hợp khung mô phỏng Smartphone tương tác trực tiếp (iPhone mockup) cho phép chuyên viên trải nghiệm chính xác những gì khách hàng sẽ nhìn thấy trên điện thoại:

1. **Thanh Header Tùy Biến**: Hiển thị Logo dự án đang chọn (The Grand Manhattan, Aqua City, The Global City...) và banner thông báo tích điểm Loyalty.
2. **Câu hỏi 1 - Thang đo NPS (0 - 10)**: Bàn phím số 11 nút bấm tương tác, chuyển màu tím khi click chọn, phân biệt rõ cực 0 (chắc chắn không) và cực 10 (chắc chắn có).
3. **Câu hỏi 2 - Thang đo CSAT (5 Sao)**: Hệ thống icon ngôi sao vàng có hiệu ứng hover và phóng to khi click, kèm nhãn phân cấp cảm xúc tương ứng.
4. **Câu hỏi 3 - Thang đo Nỗ lực CES (1 - 7)**: Thang đo nút bấm trực quan đánh giá độ dễ dàng của thủ tục ký cọc và nộp tiền.
5. **Khu vực nhập liệu & Nút Gửi**: Khách nhập Họ tên, Số điện thoại và Ý kiến đóng góp. Khi bấm **"Gửi Phản Hồi & Nhận +200 Điểm"**, dữ liệu được lưu trực tiếp vào Zustand store, lập tức kích hoạt tính toán lại toàn bộ chỉ số CSAT, NPS và thêm bản ghi vào Live Feed!

---

## 7. Các Hộp Thoại Tương Tác & Tính Năng Xuất Dữ Liệu (Modals & Export)

Phân hệ đảm bảo nguyên tắc **100% Zero Dead Buttons** với đầy đủ 5 Modal chức năng:

1. **Modal Giả Lập Đánh Giá Khách Hàng (`showSimModal`)**: Nhập tên khách, số điện thoại, dự án, kênh thu thập, số sao và nhận xét để kiểm tra tính năng tính toán lại tức thì.
2. **Modal Tạo Chiến Dịch Tự Động Mới (`showCreateCampaignModal`)**: Thiết lập tên chiến dịch, kênh gửi (Zalo ZNS, SMS, Email, App Push), kịch bản trigger và số điểm thưởng loyalty.
3. **Modal Xử Lý Khiếu Nại Red Alert (`selectedComplaint`)**: Xem chi tiết bức xúc của khách hàng, phân bổ chuyên viên xử lý và nhập biên bản giải pháp khắc phục.
4. **Modal Báo Cáo Chiến Dịch Khảo Sát (`selectedCampaignReport`)**: Xem tổng phản hồi, tỷ lệ điền form, CSAT riêng của chiến dịch và link công khai.
5. **Modal Standee QR Code Kiosk Showroom (`showQrModal`)**: Hiển thị mã QR khảo sát đặt tại quầy lễ tân sa bàn kèm nút Copy Link và Tải file in Standee A5.
6. **Xuất Báo Cáo Kiểm Toán CSV (`handleExportCSV`)**: Xuất toàn bộ danh sách phản hồi ra file CSV mã hóa chuẩn **UTF-8 BOM**, hiển thị tiếng Việt hoàn hảo trên Microsoft Excel.

---

## 8. Hướng Dẫn Vận Hành & Khuyến Nghị Thực Tiễn Dành Cho Quản Trị Viên

1. **Duy trì chỉ số NPS luôn trên ngưỡng +50**:
   * Khuyến khích chuyên viên tư vấn hướng dẫn khách hàng quét mã QR tại sa bàn ngay khi kết thúc buổi trải nghiệm nhà mẫu.
   * Kèm điểm thưởng Loyalty hoặc Voucher cà phê Phúc Long/Starbucks để tạo thiện cảm ban đầu.
2. **Giám sát chặt chẽ các phản hồi 1-2 sao**:
   * Tuyệt đối không để khiếu nại ở trạng thái `pending` quá 24 giờ.
   * Khi khách phàn nàn về thái độ sale hoặc thủ tục vay, Trưởng phòng kinh doanh phải chủ động gọi điện lắng nghe trước khi khách đăng tải lên mạng xã hội.
3. **Định kỳ kiểm toán từ khóa AI NLP**:
   * Hàng tuần xem xét cụm từ khóa trong mục *NLP Word Cloud* để phát hiện sớm các vấn đề liên quan đến nhà thầu xây dựng (nứt sơn, thấm nước, chậm bàn giao) hoặc hạ tầng giao thông kết nối dự án.
