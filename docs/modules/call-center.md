# Phân Hệ Tổng Đài Ảo VoIP Cloud & Trợ Lý Bóc Băng AI - Module `/call-center`

## 1. Tổng Quan & Tầm Nhìn Chiến Lược Tổng Đài VoIP Bất Động Sản

Trong lĩnh vực kinh doanh và môi giới bất động sản trung và cao cấp, **Cuộc gọi thoại (Voice Call)** vẫn là kênh tiếp cận có tỷ lệ chuyển đổi cao nhất. Trong khi tin nhắn hoặc email chỉ mang tính chất thông báo một chiều, một cuộc đàm thoại trực tiếp kéo dài từ 5 đến 12 phút cho phép chuyên viên tư vấn nắm bắt chính xác chân dung tài chính, tâm lý đầu tư, tháo gỡ băn khoăn về pháp lý và chốt lịch hẹn tham quan sa bàn thực tế.

Tuy nhiên, các sàn giao dịch truyền thống thường gặp 4 điểm nghẽn lớn:
1. **Thiếu cơ chế ghi âm và kiểm soát chất lượng (No Call Recording / QA)**: Lãnh đạo không biết nhân viên nói gì với khách VIP, liệu có tư vấn sai chính sách chiết khấu hoặc cam kết lợi nhuận vượt thẩm quyền hay không.
2. **Mất dữ liệu khách hàng khi môi giới nghỉ việc**: Nhân viên dùng điện thoại cá nhân gọi điện, khi rời công ty mang theo toàn bộ danh bạ và lịch sử đàm thoại.
3. **Không đo lường được chỉ số đàm thoại khoa học**: Thiếu các chỉ số đo lường như Tỷ lệ nói (Talk Ratio), Tốc độ nói (Speech Rate), và Phân loại cảm xúc (Sentiment Analysis).
4. **Nhân viên bối rối khi gặp từ chối**: Khi khách chê giá cao hoặc bảo bận họp, môi giới thường cúp máy ngay thay vì áp dụng kịch bản xử lý từ chối khéo léo để xin kết nối Zalo.

Phân hệ **Tổng Đài Ảo VoIP Cloud & Trợ Lý Bóc Băng AI (`/call-center`)** giải quyết triệt để các vấn đề trên nhờ công nghệ **Softphone WebRTC** gọi trực tiếp trên trình duyệt, hệ thống bóc băng tự động đa kênh **Speech-to-Text AI**, phân tích cảm xúc ngôn ngữ tự nhiên **NLP Sentiment** và cẩm nang xử lý từ chối thời gian thực.

```
+-----------------------------------------------------------------------------------+
|               HỆ THỐNG TỔNG ĐÀI ẢO VOIP CLOUD CRM (/call-center)                  |
+-----------------------------------------------------------------------------------+
                                          |
          +-------------------------------+-------------------------------+
          |                               |                               |
          v                               v                               v
+-------------------+           +-------------------+           +-------------------+
| SOFTPHONE WEBRTC  |           | BÓC BĂNG & AI NLP |           | CHẤM ĐIỂM QA      |
| & LIVE CALL STATE |           | PHÂN TÍCH CẢM XÚC |           | & XỬ LÝ TỪ CHỐI   |
+-------------------+           +-------------------+           +-------------------+
| - Bàn phím số DTMF|           | - Speech-to-Text  |           | - Scorecard 100đ  |
| - Đàm thoại / Mute|           | - Tỷ lệ nói (45%) |           | - Talk Ratio      |
| - Tạm giữ / Chuyển|           | - Tốc độ nói WPM  |           | - 4 Kịch bản mẫu  |
| - Timer thời gian |           | - Key Takeaways   |           | - Copy mẫu Zalo   |
| - Gác máy Wrap-up |           | - Cảm xúc 3 cấp   |           | - Tạo nhanh Lead  |
+-------------------+           +-------------------+           +-------------------+
```

---

## 2. Cấu Trúc Kỹ Thuật & Luồng Dữ Liệu (Technical Architecture)

### 2.1 File Components & Đường Dẫn
* **Giao diện điều khiển trung tâm**: [`app/(dashboard)/call-center/page.tsx`](file:///c:/Users/catmu/Downloads/crm/app/(dashboard)/call-center/page.tsx)
* **Tài liệu kỹ thuật module**: [`docs/modules/call-center.md`](file:///c:/Users/catmu/Downloads/crm/docs/modules/call-center.md)
* **Kho lưu trữ trạng thái toàn cục**: [`store/useStore.ts`](file:///c:/Users/catmu/Downloads/crm/store/useStore.ts)
* **Khai báo kiểu dữ liệu TypeScript**: [`types/index.ts`](file:///c:/Users/catmu/Downloads/crm/types/index.ts)

### 2.2 Mô Hình Dữ Liệu Thực Thể (Data Models)

#### Entity `CallLog` (Bản Ghi Cuộc Gọi & Dữ Liệu AI)
```typescript
export interface CallLog {
  id: string;                                   // Mã định danh cuộc gọi (call1, call2,...)
  name: string;                                 // Họ tên khách hàng
  phone: string;                                // Số điện thoại liên hệ
  time: string;                                 // Mốc thời gian phát sinh cuộc gọi
  duration: string;                             // Thời lượng cuộc gọi (mm:ss)
  status: 'success' | 'missed';                 // Trạng thái: Thành công hoặc Cuộc gọi nhỡ
  sentiment: 'positive' | 'neutral' | 'negative' | 'none'; // Phân loại cảm xúc AI
  scores: {
    positive: number;                           // Điểm phần trăm tích cực (0 - 100%)
    neutral: number;                            // Điểm phần trăm trung tính (0 - 100%)
    negative: number;                           // Điểm phần trăm tiêu cực (0 - 100%)
  };
  takeaways: string[];                          // Danh sách nội dung then chốt AI tóm tắt
  metrics: {
    agentTalkRatio: string;                     // Tỷ lệ thời gian chuyên viên nói (VD: '45%')
    speechRate: string;                         // Tốc độ phát âm (từ/phút, VD: '120')
  };
  transcript: TranscriptMessage[];              // Chi tiết bóc băng từng câu thoại
  agentName?: string;                           // Tên chuyên viên thực hiện cuộc gọi
  projectName?: string;                         // Dự án BĐS được trao đổi
  disposition?: 'Hẹn xem sa bàn' | 'Khách quan tâm' | 'Gọi lại sau' | 'Tư vấn vay vốn' | 'Khiếu nại tiến độ' | 'Chốt cọc thành công' | 'Không nghe máy' | 'Sai số' | string;
  qaScore?: number;                             // Điểm đánh giá chất lượng cuộc gọi (0 - 100)
  notes?: string;                               // Ghi chú sau cuộc gọi của chuyên viên
}
```

#### Entity `TranscriptMessage` (Từng Dòng Hội Thoại Bóc Băng)
```typescript
export interface TranscriptMessage {
  speaker: 'agent' | 'customer';               // Bên phát ngôn: Chuyên viên hoặc Khách hàng
  time: string;                                 // Mốc thời gian xuất hiện câu thoại (mm:ss)
  text: string;                                 // Nội dung lời thoại bóc băng
}
```

---

## 3. Công Nghệ Web Audio API Tạo Âm Thanh Bàn Phím DTMF

Để mang lại trải nghiệm bấm số chân thực như một thiết bị điện thoại phần cứng chuyên dụng, hệ thống ứng dụng chuẩn **DTMF (Dual-Tone Multi-Frequency)** theo khuyến nghị của ITU-T, sử dụng trực tiếp bộ phát dao động âm thanh (`OscillatorNode`) tích hợp sẵn trong trình duyệt qua **Web Audio API**:

Mỗi phím số là sự kết hợp của một tần số hàng thấp (Low Frequency) và một tần số cột cao (High Frequency):

| Phím Số | Tần Số Hàng Thấp ($f_1$) | Tần Số Cột Cao ($f_2$) |
| :---: | :---: | :---: |
| **`1`, `2`, `3`** | $697 \text{ Hz}$ | $1209 \text{ Hz}, 1336 \text{ Hz}, 1477 \text{ Hz}$ |
| **`4`, `5`, `6`** | $770 \text{ Hz}$ | $1209 \text{ Hz}, 1336 \text{ Hz}, 1477 \text{ Hz}$ |
| **`7`, `8`, `9`** | $852 \text{ Hz}$ | $1209 \text{ Hz}, 1336 \text{ Hz}, 1477 \text{ Hz}$ |
| **`*`, `0`, `#`** | $941 \text{ Hz}$ | $1209 \text{ Hz}, 1336 \text{ Hz}, 1477 \text{ Hz}$ |

Âm thanh được phát ra với cường độ êm dịu (`gain = 0.05`) và ngắt tự động sau 120ms, hoàn toàn không phụ thuộc vào các tệp mp3 tải từ ngoài, đảm bảo tốc độ phản hồi 0ms.

---

## 4. Trạng Thái Đàm Thoại Thời Gian Thực (Live Call Experience)

Khi người dùng nhấn phím Gọi (màu xanh lá):
1. **Khởi Tạo Cuộc Gọi**: Màn hình Softphone chuyển sang giao diện đàm thoại tối cao cấp với hiệu ứng đèn nhấp nháy xanh (Pulsing Indicator).
2. **Bộ Đếm Thời Gian Sống (Live Timer)**: Tự động đếm từng giây (`00:01`, `00:02`, `00:03`...).
3. **Phím Tác Nghiệp Đàm Thoại**:
   * **Bật/Tắt Mic (Mute Toggle)**: Chuyển đổi trạng thái ngắt micro có thông báo toast.
   * **Chuyển Cuộc Gọi (Transfer)**: Mở hộp thoại chuyển tiếp cuộc gọi sang máy lẻ nội bộ khác.
   * **Gác Máy (End Call)**: Nút tròn đỏ nổi bật. Khi kết thúc cuộc gọi, hệ thống tự động lưu bản ghi vào kho lưu trữ `callLogs` và mở Modal **Phân Loại Kết Quả (Disposition)**.

---

## 5. Quy Trình Bóc Băng Tự Động & Phân Tích Cảm Xúc AI

### 5.1 Chỉ Số Đàm Thoại Khoa Học (Speech Analytics Metrics)
* **Tỷ Lệ Chuyên Viên Nói (Agent Talk Ratio)**:
  * *Chuẩn mực vàng*: $40\% - 50\%$.
  * Chuyên viên nói quá $65\%$ thể hiện sự áp đặt, không chịu lắng nghe khách hàng.
  * Chuyên viên nói dưới $30\%$ thể hiện sự thiếu tự tin hoặc bị động trong việc dẫn dắt câu chuyện.
* **Tốc Độ Phát Âm (Speech Rate)**:
  * *Chuẩn mực vàng*: $120 - 135 \text{ từ / phút}$.
  * Khi nói về giá trị tài sản tiền tỷ, tốc độ nói cần được tiết chế chậm rãi để tạo cảm giác uy tín và an tâm.

### 5.2 Phân Loại Cảm Xúc AI (NLP Sentiment)
* **Tích Cực (Positive $\ge 70\%$)**: Khách hàng bày tỏ sự khen ngợi về vị trí dự án, quan tâm sâu đến chính sách thanh toán sớm 70% chiết khấu 8%, hoặc đồng ý lịch hẹn xem sa bàn vào cuối tuần.
* **Trung Tính (Neutral $50\% - 69\%$)**: Khách hàng hỏi các câu hỏi cơ bản về pháp lý, tiến độ bàn giao, yêu cầu gửi thêm bảng giá qua Zalo để ngâm cứu thêm.
* **Tiêu Cực (Negative $\ge 60\%$)**: Khách hàng bận họp, từ chối thẳng thừng, hoặc khiếu nại về tiến độ bàn giao căn hộ.

---

## 6. Bộ Tiêu Chuẩn Đánh Giá Chất Lượng Cuộc Gọi (AI QA Scorecard - 100 Điểm)

| Tiêu Chí Đánh Giá | Điểm Tối Đa | Mô Tả Yêu Cầu Chuyên Môn | Mức Đạt Trung Bình |
| :--- | :---: | :--- | :---: |
| **1. Chào hỏi đúng chuẩn nhận diện** | 20 | Xưng danh đầy đủ tên chuyên viên, mã máy lẻ, tên dự án và đại lý phân phối chính thức. | **20 / 20** (100%) |
| **2. Kỹ năng lắng nghe & Talk Ratio** | 20 | Nhường không gian cho khách hàng chia sẻ nhu cầu, tỷ lệ nói của sale không vượt quá 50%. | **18 / 20** (90%) |
| **3. Kiến thức rổ hàng & Ngân hàng** | 20 | Nắm chắc layout căn hộ, gói vay ưu đãi 0% lãi suất và chiết khấu thanh toán sớm. | **20 / 20** (100%) |
| **4. Kêu gọi hành động (Call To Action)** | 20 | Chốt thời gian cụ thể (sáng thứ Bảy/chiều Chủ Nhật) đón khách tại Showroom xem sa bàn. | **19 / 20** (95%) |
| **5. Thái độ nhã nhặn khi bị từ chối** | 20 | Giữ phép lịch sự khi khách bận, khéo léo xin phép kết nối Zalo gửi tài liệu tóm tắt. | **14 / 20** (70%) |
| **TỔNG ĐIỂM CHẤT LƯỢNG TOÀN SÀN** | **100** | **Phân loại: Hạng A (Senior Sales Expert) — Đạt chuẩn xuất sắc** | **91 / 100** |

---

## 7. Cẩm Nang Kịch Bản Xử Lý Từ Chối Telesale BĐS (Objection Handling)

Hệ thống tích hợp sẵn 4 kịch bản đối thoại mẫu giải quyết các tình huống khó khăn nhất:

1. **Khách chê giá dự án cao hơn khu vực**:
   * *Thông điệp cốt lõi*: Phân tích giá trị hoàn thiện bàn giao full nội thất cao cấp (Kohler/Hafele), hệ kính Low-E cách âm nhiệt và hệ sinh thái tiện ích khép kín.
   * *Nút thao tác*: 1-click copy mẫu tin nhắn Zalo gửi bảng so sánh suất đầu tư.
2. **Khách e ngại hạ tầng giao thông hoặc đường xa**:
   * *Thông điệp cốt lõi*: Nhấn mạnh tiến độ hoàn thành các công trình hạ tầng trọng điểm (Cầu Vàm Cái Sứt, Hương Lộ 2, Đường Vành Đai 3). Tặng vé du thuyền đón khách từ bến Bạch Đằng.
3. **Khách báo đang bận họp, không có thời gian**:
   * *Thông điệp cốt lõi*: Xin lỗi khéo léo, xin phép gửi brochure tóm tắt 3 trang qua Zalo để khách xem lúc rảnh, cam kết không gọi điện làm phiền.
4. **Khách lo ngại lãi suất thả nổi sau thời gian ưu đãi**:
   * *Thông điệp cốt lõi*: Phân tích bài toán dòng tiền cho thuê căn hộ đạt 30-45 triệu/tháng để bù trừ trực tiếp vào tiền gốc lãi ngân hàng.

---

## 8. Hệ Thống 5 Modals Tương Tác & Xuất Báo Cáo CSV (Zero Dead Buttons)

1. **Modal Chuyển Cuộc Gọi Nội Bộ (`showTransferModal`)**: Chuyển tiếp cuộc gọi kèm ghi chú cho chuyên viên phụ trách dự án (Lê Hoàng Anh Ext 103, Thanh Hà Ext 102, Bảo Trần Ext 104).
2. **Modal Phân Loại Kết Quả Cuộc Gọi (`showDispositionModal`)**: Ghi nhận kết quả đàm thoại (Hẹn xem sa bàn, Khách quan tâm, Gọi lại sau, Sai số) và cập nhật ghi chú vào kho dữ liệu CRM.
3. **Modal Cẩm Nang Tra Cứu Kịch Bản Nhanh (`showScriptModal`)**: Mẹo đối thoại nhanh giúp chuyên viên tự tin đàm phán trong lúc đang nghe điện thoại.
4. **Modal Bảng Điểm Kiểm Tra Chất Lượng QA (`showQAModal`)**: Bảng chấm điểm chi tiết 5 tiêu chí kỹ năng của chuyên viên.
5. **Modal Tạo Nhanh Hồ Sơ Khách Hàng Mới (`showNewContactModal`)**: Tạo nhanh hồ sơ khách hàng mới trực tiếp từ số điện thoại vừa quay (`addCustomer`).
6. **Nút Xuất Báo Cáo CSV (`handleExportCSV`)**: Xuất toàn bộ nhật ký cuộc gọi, thời lượng, cảm xúc và điểm QA ra file CSV mã hóa chuẩn **UTF-8 BOM**, hiển thị tiếng Việt hoàn hảo trên Microsoft Excel.
