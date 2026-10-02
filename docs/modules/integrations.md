# Phân Hệ Tích Hợp API, Webhook & ERP - Module `/integrations`

## 1. Tổng Quan & Tầm Nhìn Chiến Lược Tích Hợp Hệ Thống Doanh Nghiệp Địa Ốc

Trong kỷ nguyên chuyển đổi số bất động sản (PropTech 2026), một phần mềm CRM không thể đứng độc lập như một "ốc đảo dữ liệu" (Data Silo). Đối với các tập đoàn phát triển địa ốc và các tổng đại lý phân phối lớn (Novaland, Vinhomes, Masterise Homes, Khang Điền, Đất Xanh...), hiệu quả kinh doanh phụ thuộc trực tiếp vào **khả năng liên thông dữ liệu thời gian thực (Real-time Interoperability)** giữa 5 trụ cột công nghệ:
1. **Trụ cột Kế toán & Quản trị nguồn lực (ERP & Accounting)**: Dữ liệu giao dịch đặt cọc, hợp đồng mua bán, bảng tiến độ thanh toán phải được gạch nợ tức thì và tự động đẩy sang phần mềm kế toán MISA, FAST hoặc SAP S/4HANA để tính doanh thu và hoa hồng môi giới.
2. **Trụ cột Thanh toán & Ngân hàng số (Fintech & VietQR PRO)**: Tự động phát hành mã VietQR động NAPAS 247 cho từng đợt đóng tiền, tiếp nhận tín hiệu IPN (Instant Payment Notification) để khóa căn và giải phóng phiếu thu tự động mà không cần kế toán đối soát thủ công.
3. **Trụ cột Giao tiếp Đa kênh (Omnichannel & Zalo ZNS)**: Gửi thông báo chăm sóc khách hàng, lịch ký hợp đồng và tiến độ công trình qua Zalo OA với tỷ lệ mở 98% và chi phí tiết kiệm 70% so với SMS truyền thống.
4. **Trụ cột Pháp lý & Ký số từ xa (eKYC & SmartCA)**: Xác thực thẻ CCCD gắn chip bằng OCR sinh trắc học và ký kết Hợp Đồng Mua Bán điện tử có chứng thư số được Bộ Thông tin & Truyền thông cấp phép theo Luật Giao dịch điện tử 2023.
5. **Trụ cột Kiến trúc Sự kiện & Webhooks (Event-driven Webhook Streaming)**: Phát tín hiệu tự động cho các bên thứ ba khi có biến động về khách hàng (`lead.created`), đặt cọc (`booking.deposited`), hoặc thay đổi giỏ hàng (`property.locked`).

### 1.1 Sơ Đồ Kiến Trúc Liên Thông Hệ Thống (Enterprise Integration Hub Diagram)
```
+-----------------------------------------------------------------------------------------+
|                  CỔNG TÍCH HỢP DOANH NGHIỆP NOVA ENTERPRISE HUB (/integrations)         |
+-----------------------------------------------------------------------------------------+
                                             |
             +-------------------------------+-------------------------------+
             |                               |                               |
             v                               v                               v
+-------------------------+     +-------------------------+     +-------------------------+
| CHỢ KẾT NỐI 12 DỊCH VỤ  |     | TRẠM WEBHOOKS STREAMING |     | BẢO MẬT & API KEYS      |
+-------------------------+     +-------------------------+     +-------------------------+
| - Zalo Cloud & ZNS      |     | - lead.created          |     | - Khóa Master Backend   |
| - MISA AMIS & FAST ERP  |     | - booking.deposited     |     | - Khóa MISA ERP         |
| - VietQR PRO / NAPAS    |     | - contract.signed       |     | - Phân quyền Read/Write |
| - VNPT eKYC & SmartCA   |     | - payment.vietqr_ipn    |     | - IP Whitelist Firewall |
| - Stringee VoIP & Maps  |     | - Trình bắn thử Payload |     | - Chữ ký HMAC-SHA256    |
+-------------------------+     +-------------------------+     +-------------------------+
                                             |
             +-------------------------------+-------------------------------+
             |                               |                               |
             v                               v                               v
+-------------------------+     +-------------------------+     +-------------------------+
| PING TEST HANDSHAKE TLS |     | GẠCH NỢ TỰ ĐỘNG VIETQR  |     | NHẬT KÝ TRAFFIC AUDIT   |
| (Kiểm tra kết nối tức thì)    | (Mô phỏng cọc 200 Triệu)|     | (Theo dõi mã 200/400 ms)|
+-------------------------+     +-------------------------+     +-------------------------+
```

---

## 2. Cấu Trúc Kỹ Thuật & Luồng Dữ Liệu (Technical Architecture)

### 2.1 File Components & Đường Dẫn Mã Nguồn
* **Giao diện trang tích hợp**: [`app/(dashboard)/integrations/page.tsx`](file:///c:/Users/catmu/Downloads/crm/app/(dashboard)/integrations/page.tsx)
* **Tài liệu kỹ thuật module**: [`docs/modules/integrations.md`](file:///c:/Users/catmu/Downloads/crm/docs/modules/integrations.md)
* **Kho lưu trữ trạng thái toàn cục**: [`store/useStore.ts`](file:///c:/Users/catmu/Downloads/crm/store/useStore.ts)
* **Khai báo kiểu dữ liệu TypeScript**: [`types/index.ts`](file:///c:/Users/catmu/Downloads/crm/types/index.ts)

### 2.2 Mô Hình Dữ Liệu Thực Thể (Data Models)

#### Entity `IntegrationApp` (Dịch Vụ Đối Tác Tích Hợp)
```typescript
export interface IntegrationApp {
  id: string;                                   // Mã định danh ('zalo', 'misa', 'vietqr', 'vnpt_ekyc'...)
  name: string;                                 // Tên hiển thị đầy đủ
  category: 'communication' | 'finance' | 'payment' | 'legal' | 'utilities'; // Phân nhóm nghiệp vụ
  iconName: string;                             // Tên biểu tượng nhận diện Lucide
  desc: string;                                 // Mô tả bài toán nghiệp vụ liên thông
  connected: boolean;                           // Trạng thái kết nối (true: Đã kết nối, false: Tạm ngắt)
  lastSync?: string;                            // Thời điểm đồng bộ gần nhất
  requestCount24h?: number;                     // Tổng lưu lượng cuộc gọi trong 24 giờ qua
  endpoint?: string;                            // URL API Gateway của đối tác
  apiKey?: string;                              // Token / Khóa bí mật cấu hình
  latencyMs?: number;                           // Độ trễ phản hồi mạng trung bình (ms)
  provider: string;                             // Đơn vị phát triển (VNG, MISA, VietQR, VNPT, Google...)
}
```

#### Entity `WebhookItem` (Trạm Lắng Nghe Webhook Sự Kiện)
```typescript
export interface WebhookItem {
  id: string;                                   // Mã webhook ('wh-1', 'wh-2')
  name: string;                                 // Tên sự kiện ('Đặt Cọc Giữ Chỗ')
  event: string;                                // Mã topic ('booking.deposited', 'contract.signed')
  targetUrl: string;                            // URL máy chủ đích nhận payload POST
  active: boolean;                              // Trạng thái bật/tắt lắng nghe
  successRate: number;                          // Tỷ lệ phân phối thành công (HTTP 200 OK)
  lastTriggered: string;                        // Thời gian phát sự kiện gần nhất
  deliveriesCount: number;                      // Tổng số gói tin đã phát sóng
  secretKey?: string;                           // Khóa ký số HMAC-SHA256
}
```

#### Entity `ApiKeyItem` (Cặp Khóa API Doanh Nghiệp)
```typescript
export interface ApiKeyItem {
  id: string;                                   // Mã định danh khóa ('key-1')
  name: string;                                 // Tên mục đích cấp phát
  prefix: string;                               // Tiền tố khóa hiển thị ('nova_live_sec_88f2')
  keyMasked: string;                            // Chuỗi token đã che mờ bảo mật
  permissions: 'read' | 'read_write' | 'admin'; // Phạm vi quyền hạn truy cập
  ipWhitelist: string;                          // Danh sách IP được phép gọi (Firewall)
  createdAt: string;                            // Ngày khởi tạo
  expiresAt: string;                            // Hạn dùng
  status: 'active' | 'revoked' | 'expired';     // Trạng thái khóa
}
```

#### Entity `ApiAuditLog` (Nhật Ký Lưu Lượng Truy Xuất API)
```typescript
export interface ApiAuditLog {
  id: string;                                   // Mã log
  timestamp: string;                            // Thời gian ghi nhận ('10:35:12')
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';    // Phương thức HTTP
  endpoint: string;                             // Đường dẫn API ('/api/v1/payments/vietqr/ipn')
  service: string;                              // Dịch vụ gọi ('VietQR NAPAS')
  ip: string;                                   // IP nguồn
  statusCode: number;                           // Mã HTTP Status (200, 201, 401...)
  latencyMs: number;                            // Thời gian xử lý yêu cầu (ms)
  payloadSnippet: string;                       // Tóm tắt gói tin JSON
}
```

### 2.3 Cơ Chế Xác Thực Chữ Ký Số HMAC-SHA256
Mọi gói tin Outbound Webhook do hệ thống Nova CRM phát đi đều được gắn kèm chữ ký xác thực điện tử tại HTTP Header:
```http
POST /misa/sync-deposit HTTP/1.1
Host: accounting.novaland.com.vn
Content-Type: application/json
X-Nova-Event: booking.deposited
X-Nova-Delivery-Id: del_1718902910
X-Nova-Signature: sha256=9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
```
Máy chủ kế toán đối tác sử dụng Secret Key chia sẻ để tính toán lại mã hash, đảm bảo gói tin không bị can thiệp trên đường truyền (Man-in-the-middle Protection).

---

## 3. Chi Tiết Các Chức Năng Nghiệp Vụ & 5 Zero-Dead-Button Modals

### 3.1 4 Chỉ Số Vĩ Mô (Macro KPI Cards)
1. **Cổng Đang Kết Nối**: 7/12 Dịch vụ đang hoạt động với cam kết SLA 99.98%.
2. **Lưu Lượng Gọi API (24h)**: 48.250 requests được xử lý với độ trễ trung bình 112ms.
3. **Trạm Webhooks Lắng Nghe**: 6/6 sự kiện đang kích hoạt truyền phát tự động với tỷ lệ gửi thành công 99.9%.
4. **Tỷ Lệ Lỗi (Error Rate)**: 0.02%, cơ chế retry tự động tối đa 3 lần với backoff lũy thừa.

### 3.2 4 Tabs Tác Nghiệp Chuyên Sâu

#### Tab 1: Chợ Kết Nối Ứng Dụng (App Directory & Integration Cards)
* Hỗ trợ 12 dịch vụ thực tế của các tập đoàn công nghệ hàng đầu: Zalo ZNS, Kế toán MISA AMIS, FAST Accounting, SAP S/4HANA, VietQR PRO, VNPay, MoMo Business, VNPT eKYC, VNPT SmartCA, Stringee VoIP, Google Maps, Google Drive.
* Bộ lọc theo 5 danh mục nghiệp vụ và ô tìm kiếm nhanh.
* Thẻ card hiển thị logo, badge trạng thái (Đã kết nối / Chưa kết nối), lưu lượng 24h, độ trễ và thời gian đồng bộ cuối.
* Nút gạt chuyển đổi trạng thái kết nối tức thì và nút **"Cấu Hình & Test"** mở modal cấu hình.

#### Tab 2: Trạm Giám Sát Webhooks & Trình Bắn Thử Payload (Webhooks & Event Stream)
* **Trình Giả Lập Bắn Thử Webhook (Live Ping Simulator)**:
  - Chọn 1 trong 5 sự kiện BĐS (`booking.deposited`, `lead.created`, `contract.signed`, `payment.vietqr_ipn`, `property.emergency_locked`).
  - Tự động điền URL endpoint đích tương ứng và hiển thị cấu trúc Payload JSON mẫu.
  - Bấm nút **"🚀 Bắn Thử Sự Kiện (Test Ping)"** -> Hệ thống mô phỏng truyền tin mạng và hiển thị kết quả HTTP 200 OK, độ trễ ms và JSON phản hồi thực tế.
* **Danh sách 6 Outbound Webhooks**:
  - Tên webhook, URL đích, tỷ lệ % thành công, số lượt phát tin, lần cuối phát.
  - Công tắc Bật/Tắt webhook và nút xem cấu trúc Payload kỹ thuật.

#### Tab 3: Quản Lý Khóa API Doanh Nghiệp & Bảo Mật (API Keys & Security Whitelist)
* Danh sách 4 cặp khóa API doanh nghiệp được mã hóa: Khóa Master Backend, Khóa MISA ERP, Khóa Web Landing Page, Khóa Sandbox Staging.
* Hiển thị tiền tố prefix, khóa masked, phân quyền (Admin, Read-Write, Read-only), IP Whitelist, ngày tạo và ngày hết hạn.
* Nút **Sao chép Token** 1-chạm vào clipboard và nút **Thu Hồi Khóa (Revoke)** khi phát hiện rò rỉ bảo mật.

#### Tab 4: Nhật Ký Lưu Lượng Truy Xuất & Kiểm Toán API (Audit Logs)
* Bảng nhật ký thời gian thực theo dõi từng cuộc gọi API vào CRM: Thời gian, Method (GET xanh lá, POST xanh dương, PUT cam), Endpoint, Dịch vụ gọi, IP, Mã HTTP Status (200, 201, 401), Độ trễ ms.
* Bộ lọc trạng thái HTTP (Tất cả, Chỉ 2xx Thành công, Chỉ 4xx/5xx Có lỗi).

### 3.3 Hệ Thống 5 Modals Nghiệp Vụ Tương Tác Chuyên Sâu

#### Modal 1: Cấu Hình & Kiểm Tra Bắt Tay Mạng (`selectedAppForConfig`)
* Form cấu hình: Endpoint API URL, Client Secret / API Key, Webhook Callback URL của CRM (có nút sao chép nhanh).
* Nút **"🔌 Kiểm Tra Kết Nối (Ping Test)"**: Kích hoạt tiến trình bắt tay mạng TLS 1.3 và kiểm tra OAuth token, đo đạc độ trễ mạng thực tế (65 - 110ms) và trả về thông báo xác nhận.
* Nút **"Lưu Cấu Hình & Kích Hoạt"**: Cập nhật trực tiếp vào Zustand store.

#### Modal 2: Cấp Phát API Key Doanh Nghiệp Mới (`showCreateKeyModal`)
* Nhập tên ứng dụng sử dụng, lựa chọn phân quyền (Chỉ đọc, Đọc & Ghi, Toàn quyền Admin), địa chỉ IP Whitelist và ngày hết hiệu lực.
* Sinh mã ngẫu nhiên bảo mật dạng `nova_live_sec_...` và tự động thêm vào danh sách quản lý.

#### Modal 3: Chi Tiết Gói Tin Webhook Payload (`selectedWebhookPayloadModal`)
* Hiển thị cấu trúc Request Headers đầy đủ chứa chữ ký HMAC-SHA256, Delivery ID và Request Body JSON của sự kiện.
* Nút **"Gửi Lại Gói Tin (Replay Delivery)"** mô phỏng phát lại sự kiện trong trường hợp máy chủ đối tác gặp sự cố tạm thời.

#### Modal 4: Yêu Cầu Tích Hợp Hệ Thống Mới (`showRequestIntegrationModal`)
* Tiếp nhận yêu cầu liên thông phần mềm mới từ các phòng ban (VD: Oracle NetSuite, Tổng đài Callio, Hệ thống khách sạn Opera...).
* Ghi nhận vào danh mục mở rộng với nhãn "Yêu cầu mở rộng" và thông báo Toast xác nhận.

#### Modal 5: Cấu Hình Gạch Nợ Tự Động VietQR IPN (`showVietQrConfigModal`)
* Cấu hình thông tin tài khoản thụ hưởng của CĐT: Ngân hàng (Vietcombank, MBBank), số tài khoản, tên tài khoản và cú pháp ủy nhiệm chi nhận diện tự động (`[MÃ CĂN] - [HỌ TÊN] - [ĐỢT N]`).
* Nút **"Bắn Thử Tiền Cọc 200 Triệu (Simulate IPN)"**: Giả lập khách hàng quét mã chuyển tiền qua NAPAS 247, hệ thống tiếp nhận gói tin IPN và gạch nợ thành công sau 3 giây.

### 3.4 Xuất Khẩu Báo Cáo Kiểm Toán CSV UTF-8 BOM
* Nút **Xuất Báo Cáo (.CSV)** sử dụng tiền tố `\uFEFF`, xuất toàn bộ danh mục dịch vụ tích hợp, trạng thái kết nối, lượt gọi 24h, độ trễ và nhà cung cấp mà không bị lỗi font tiếng Việt trên Microsoft Excel.

---

## 4. Ma Trận Kiểm Thử Nghiệp Vụ Chi Tiết (8/8 Test Matrix - PASS)

| Test ID | Kịch Bản Kiểm Thử | Dữ Liệu Đầu Vào | Các Bước Thực Hiện | Kết Quả Kỳ Vọng | Trạng Thái |
|:---|:---|:---|:---|:---|:---:|
| **TC-INT-01** | Lọc Chợ Ứng Dụng Theo Danh Mục | Chọn chip "Tài Chính & Kế Toán ERP" | Nhấp vào chip filter danh mục trên thanh công cụ | Chỉ hiển thị các phần mềm MISA, FAST, SAP; danh sách cập nhật ngay lập tức | **PASS** |
| **TC-INT-02** | Bật/Tắt Kết Nối Ứng Dụng Nhanh | Click nút gạt toggle của ứng dụng Zalo | Nhấp vào nút gạt bật/tắt kết nối | Trạng thái chuyển đổi mượt mà, badge cập nhật "Đã kết nối" / "Chưa kết nối", Toast hiển thị | **PASS** |
| **TC-INT-03** | Cấu Hình & Ping Test Handshake | Mở Modal 1 của Kế toán MISA, bấm "Kiểm tra kết nối" | Kích hoạt `handleTestPing` | Đo đạc độ trễ mạng thực tế (65 - 110ms), hiển thị hộp thông báo HTTP 200 OK màu xanh | **PASS** |
| **TC-INT-04** | Giả Lập Bắn Thử Sự Kiện Webhook | Chọn sự kiện `booking.deposited`, bấm "Bắn Thử Sự Kiện" | Kích hoạt `handleSimulateWebhook` | Hiển thị kết quả HTTP 200 OK, latency ms và response body JSON thành công | **PASS** |
| **TC-INT-05** | Cấp Phát API Key Doanh Nghiệp Mới | Nhập tên "Khóa Landing Page Aqua City", quyền Read-Write | Bấm "Sinh Mã Khóa Mới" trong Modal 2 | Khóa mới xuất hiện trong danh sách với prefix `nova_live_*`, trạng thái Active | **PASS** |
| **TC-INT-06** | Thu Hồi Quyền Truy Cập API Key | Nhấp nút "Thu Hồi Khóa" trên khóa Staging | Kích hoạt `revokeApiKey` | Trạng thái khóa chuyển sang "Đã thu hồi" màu đỏ, nút thu hồi bị vô hiệu hóa | **PASS** |
| **TC-INT-07** | Bắn Thử Tiền Cọc VietQR IPN 200Tr | Nhấp nút "Bắn Thử Tiền Cọc 200 Triệu" trong Modal 5 | Kích hoạt luồng giả lập IPN Webhook | Hiển thị Toast xác nhận gạch nợ thành công căn AQC-PH-102 | **PASS** |
| **TC-INT-08** | Xuất Báo Cáo Kiểm Toán CSV UTF-8 | Nhấp nút "Xuất Báo Cáo (.CSV)" | Kích hoạt `handleExportCSV` | Tải về file `BaoCao_TichHop_API_ERP_NovaCRM_*.csv`, mở trên Excel chuẩn font tiếng Việt | **PASS** |

---

## 5. Hướng Dẫn Vận Hành & Tích Hợp Kỹ Thuật Dành Cho Quản Trị Viên

### 5.1 Quy Trình Tích Hợp Phần Mềm Kế Toán MISA AMIS
1. Truy cập trang Quản trị MISA AMIS Kế toán, tạo tài khoản tích hợp (Integration Account) và lấy **Client ID** cùng **Client Secret**.
2. Tại CRM Novaland `/integrations`, mở thẻ **Kế Toán MISA AMIS**, bấm **"Cấu Hình & Test"**.
3. Dán Endpoint API MISA và Secret Token vào form.
4. Bấm **"Kiểm Tra Kết Nối (Ping Test)"** để xác thực bắt tay mạng TLS 1.3.
5. Sao chép Webhook Callback URL của CRM dán vào mục Webhook của MISA để nhận thông báo phiếu thu tự động.
6. Bấm **"Lưu Cấu Hình & Kích Hoạt"**.

### 5.2 Xử Lý Sự Cố Rò Rỉ Khóa API Key
* Khi phát hiện cuộc gọi bất thường từ địa chỉ IP lạ không nằm trong IP Whitelist hoặc nghi ngờ lộ mã Token:
  1. Vào Tab **Khóa API Keys**, tìm khóa bị nghi ngờ.
  2. Bấm nút **"Thu Hồi Khóa"** ngay lập tức để cắt đứt quyền truy cập trong 0 giây.
  3. Bấm **"Tạo Khóa Mới"**, thiết lập lại IP Whitelist nghiêm ngặt và gửi mã khóa mới cho đối tác qua kênh liên lạc bảo mật.
