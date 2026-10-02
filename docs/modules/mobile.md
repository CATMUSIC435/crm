# Phân Hệ Trạm Di Động PWA Đi Thị Trường - Module `/mobile`

## 1. Tổng Quan & Tầm Nhìn Chiến Lược Ứng Dụng Thực Địa Trong BĐS Cao Cấp

Trong ngành kinh doanh và môi giới bất động sản cao cấp, hơn **70% thời gian tác nghiệp mang tính quyết định giao dịch** của chuyên viên kinh doanh diễn ra ngoài văn phòng:
* Dẫn khách hàng VIP tham quan thực địa đại dự án nghỉ dưỡng (NovaWorld Phan Thiết 1.000 ha, Aqua City Đảo Phượng Hoàng 1.000 ha, The Global City 117 ha...).
* Tiếp khách trực tiếp tại Showroom sa bàn, nhà mẫu thực tế (Mockup Villa, Penthouse, Sky Villa).
* Tham gia các sự kiện mở bán tập trung quy mô hàng nghìn khách tại trung tâm hội nghị hoặc khách sạn 5 sao.

### 1.1 Những Thách Thức Công Nghệ Lớn Khi Đi Thực Địa (Field Sales Pain Points):
1. **"Điểm mù" sóng di động (Offline Dead Zones)**: Tại các đại công trường ven biển hoặc cù lao sinh thái, hạ tầng viễn thông thường xuyên chập chờn. Khi dẫn khách vào sâu trong khu biệt thự hoặc tầng hầm, mạng 4G/5G bị mất kết nối hoàn toàn. Nếu ứng dụng CRM phụ thuộc vào kết nối trực tuyến liên tục (Online-dependent), chuyên viên không thể kiểm tra tình trạng rổ hàng, không thể lấy chữ ký cọc và có nguy cơ để tuột mất giao dịch.
2. **Nguy cơ trùng căn (Double Booking Collision)**: Khi hai chuyên viên cùng tư vấn một căn biệt thự góc đắc địa cho hai khách hàng khác nhau tại sự kiện mở bán, tốc độ khóa căn khẩn cấp tính bằng từng giây. Chậm trễ trong việc cập nhật giỏ hàng sẽ dẫn đến xung đột và khiếu nại gay gắt.
3. **Thao tác ký cọc rườm rà bằng giấy tờ**: Khách hàng thượng lưu thường ngại thủ tục in ấn hồ sơ giấy tờ cồng kềnh ngay tại công trường lộng gió hoặc bến du thuyền. Việc ký cọc điện tử trực tiếp trên màn hình cảm ứng điện thoại giúp rút ngắn thời gian chốt giao dịch xuống dưới 3 phút.
4. **Phụ thuộc kho ứng dụng Apple App Store / Google Play**: Quy trình duyệt ứng dụng nội bộ doanh nghiệp trên App Store mất từ 3-7 ngày, gây khó khăn cho việc cập nhật nhanh các tính năng, bảng giá hoặc sửa lỗi nóng trong chiến dịch mở bán.

### 1.2 Giải Pháp: Ứng Dụng Di Động Cấp Doanh Nghiệp Nova Field PWA (`/mobile`)
Phân hệ **Trạm Di Động PWA Đi Thị Trường** cung cấp giải pháp toàn diện:
* **Kiến Trúc Ngoại Tuyến (Offline-First Architecture)**: Tích hợp Service Worker, Cache API và IndexedDB Sync Queue. Mọi tác vụ (Ký hợp đồng cọc, Check-in tọa độ GPS, Quét thẻ căn cước eKYC, Ghi âm đàm phán) đều được lưu trữ an toàn trong bộ nhớ máy cục bộ và tự động đồng bộ (Background Sync) lên Máy chủ ngay khi có sóng trở lại.
* **Cài đặt không cần kho ứng dụng (Progressive Web App)**: Cài đặt trực tiếp lên màn hình chính (Add to Home Screen) của iPhone và Android thông qua file `manifest.json`, khởi chạy toàn màn hình không viền trình duyệt.
* **Ký Hợp Đồng Cọc Điện Tử 1-Chạm (E-Signature with GPS Timestamp)**: Hỗ trợ vẽ chữ ký mượt mà trên Canvas, đóng dấu mộc thời gian tọa độ GPS thực địa và mã băm SHA-256 chống chối bỏ.
* **Khóa Căn Khẩn Cấp (15-Minute Emergency Lock)**: Cho phép chuyên viên giữ chỗ tức thì ngay trong rổ hàng trên di động để ưu tiên khách đang có mặt tại hiện trường.
* **Trung Tâm Bắn Thông Báo Đẩy Thời Gian Thực (Push Broadcaster)**: Bắn thông báo khẩn "Ting-ting" xuống điện thoại của toàn bộ 142 chuyên viên với chuông âm thanh Web Audio native.

```
+-----------------------------------------------------------------------------------------+
|                  TRẠM DI ĐỘNG PWA ĐI THỊ TRƯỜNG NOVA FIELD HUB (/mobile)                |
+-----------------------------------------------------------------------------------------+
                                             |
             +-------------------------------+-------------------------------+
             |                               |                               |
             v                               v                               v
+-------------------------+     +-------------------------+     +-------------------------+
| 4 CHỈ SỐ VĨ MÔ PWA HUB  |     | GIẢ LẬP IPHONE 16 PRO   |     | TRUNG TÂM CHỈ HUY SÀN   |
+-------------------------+     +-------------------------+     +-------------------------+
| - 142 Thiết bị kích hoạt|     | - Dynamic Island đa năng|     | - Bộ điều khiển Offline |
| - Hàng đợi Sync Queue   |     | - Rổ hàng & Khóa căn 15p|     | - Quản trị Sync Queue   |
| - Tỷ lệ đồng bộ: 99.8%  |     | - Chữ ký HĐ Cọc Canvas  |     | - Push Broadcaster      |
| - Thông báo đẩy trong ngày|   | - GPS & eKYC & Ghi âm   |     | - Giám sát GPS Sale     |
+-------------------------+     +-------------------------+     +-------------------------+
                                             |
             +-------------------------------+-------------------------------+
             |                               |                               |
             v                               v                               v
+-------------------------+     +-------------------------+     +-------------------------+
| XEM HĐMB KÝ SỐ KHỔ A4   |     | CÀI ĐẶT PWA MOBILE QR   |     | QUÉT THẺ CCCD eKYC      |
| (Mộc đỏ, GPS, SHA-256)  |     | (Không cần App Store)   |     | (Laser Scanner OCR)     |
+-------------------------+     +-------------------------+     +-------------------------+
```

---

## 2. Cấu Trúc Kỹ Thuật & Luồng Dữ Liệu (Technical Architecture)

### 2.1 File Components & Đường Dẫn Mã Nguồn
* **Giao diện Trạm Di Động & Giả lập iPhone**: [`app/(dashboard)/mobile/page.tsx`](file:///c:/Users/catmu/Downloads/crm/app/(dashboard)/mobile/page.tsx)
* **Tài liệu kỹ thuật module**: [`docs/modules/mobile.md`](file:///c:/Users/catmu/Downloads/crm/docs/modules/mobile.md)
* **Kho lưu trữ trạng thái toàn cục**: [`store/useStore.ts`](file:///c:/Users/catmu/Downloads/crm/store/useStore.ts)
* **Khai báo kiểu dữ liệu TypeScript**: [`types/index.ts`](file:///c:/Users/catmu/Downloads/crm/types/index.ts)

### 2.2 Mô Hình Dữ Liệu Thực Thể (Data Models)

#### Entity `SyncTask` (Tác Vụ Hàng Đợi Ngoại Tuyến)
```typescript
export interface SyncTask {
  id: number;                                   // Mã tác vụ định danh dạng timestamp (17189001)
  task: string;                                 // Tên tác vụ ('Chữ ký HĐ Cọc #HD-928')
  time: string;                                 // Thời gian ghi nhận ('09:15')
  type?: 'signature' | 'gps' | 'kyc' | 'voice' | 'lock'; // Phân loại hành động thực địa
  status?: 'pending' | 'syncing' | 'synced' | 'failed'; // Tình trạng đồng bộ
  payload?: string;                             // Dữ liệu gói tin thô hoặc chữ ký băm
  retryCount?: number;                          // Số lần tự động thử lại khi có sóng
  locationName?: string;                        // Tên địa điểm thực địa ('Showroom Đảo Phượng Hoàng')
  customerName?: string;                        // Tên khách hàng giao dịch ('Nguyễn Văn Tuấn')
  propertyCode?: string;                        // Mã căn hộ gắn liền ('AQC-PH-102')
}
```

#### Entity `MobileNotification` (Thông Báo Đẩy Broadcast Xuống Di Động)
```typescript
export interface MobileNotification {
  id: number;                                   // Mã thông báo
  title: string;                                // Tiêu đề thông báo ('🔥 Bung Hàng Gấp...')
  message: string;                              // Nội dung chi tiết thông báo
  time: string;                                 // Thời gian phát sóng ('09:05')
  type?: 'urgent' | 'reward' | 'event' | 'deal' | 'system'; // Phân loại tính chất bản tin
  targetAudience?: string;                      // Nhóm đối tượng nhận ('Toàn bộ Sales', 'Team Q1'...)
  read?: boolean;                               // Trạng thái đã xem trên thiết bị
}
```

### 2.3 Cơ Chế Âm Thanh Bản Địa Native Web Audio API
Hệ thống sử dụng bộ tổng hợp âm thanh Web Audio API thuần túy trực tiếp trong trình duyệt, không dựa vào file mp3 ngoài (tránh lỗi 404 hoặc độ trễ tải mạng):
```typescript
const playChimeSound = () => {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(784, ctx.currentTime) // Tần số G5
  osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.12) // Lướt lên C6
  gain.gain.setValueAtTime(0.25, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.38)
}
```

---

## 3. Chi Tiết Các Chức Năng Nghiệp Vụ & Thiết Kế Siêu Thực Tế

### 3.1 4 Thẻ Chỉ Số Vĩ Mô (Macro KPI Cards)
1. **Thiết Bị Kích Hoạt**: 142 thiết bị iPhone/Android của chuyên viên kinh doanh đang chạy PWA với Service Worker trạng thái kích hoạt.
2. **Hàng Đợi Chờ Gửi (Sync Queue)**: Số lượng tác vụ thực địa đang lưu an toàn trong IndexedDB của thiết bị, sẵn sàng đẩy lên server.
3. **Tỷ Lệ Đồng Bộ Thành Công**: 99.8% độ tin cậy giao dịch, cam kết zero-data-loss ngay cả khi sập nguồn hoặc mất mạng đột ngột.
4. **Thông Báo Đẩy Broadcast**: Số lượng bản tin khẩn, thông báo bung hàng và lịch xe đưa đón đã phát sóng trong ngày.

### 3.2 Giả Lập iPhone 16 Pro Max Siêu Thực Tế (Device Simulator)
* **Khung viền Titanium 3D**: Đường cong chuẩn xác của iPhone 16 Pro Max với phím bấm vật lý tương tác được:
  - *Action Button*: Bấm để mở nhanh Camera quét eKYC.
  - *Volume Up / Down*: Tăng giảm âm lượng chuông thông báo.
  - *Power Button*: Bật/tắt màn hình mô phỏng.
* **Dynamic Island tương tác**:
  - Chạm vào Dynamic Island để mở rộng thanh trạng thái chi tiết (hiển thị trạng thái kết nối mạng 5G/Offline, số tác vụ đang xếp hàng).
  - Tự động trượt banner thông báo iOS xuống từ Dynamic Island khi có push notification broadcast.
* **Thanh trạng thái iOS 18**: Hiển thị đồng hồ 09:41, pin 98%, biểu tượng Wifi/5G hoặc thông báo "Mất sóng" màu đỏ rực khi chuyển chế độ Offline.

### 3.3 4 Tab Nghiệp Vụ Trên Màn Hình Di Động Field App
1. **Tab 1: Rổ Hàng Nhanh & Khóa Căn 15 Phút (`activeAppTab === 'inventory'`)**:
   - Tra cứu giỏ hàng tồn kho thời gian thực được đồng bộ từ cơ sở dữ liệu `inventory`.
   - Bộ lọc theo dự án (Aqua City, The Grand Manhattan, NovaWorld...) và ô tìm kiếm nhanh.
   - Nút **"Khóa 15p"** dành cho các căn trạng thái 'Trống': Lập tức chuyển sang hàng đợi hoặc cập nhật trạng thái Booking để bảo vệ quyền ưu tiên cho khách thực địa.
2. **Tab 2: E-Signature Ký Hợp Đồng Cọc Điện Tử (`activeAppTab === 'sign'`)**:
   - Hiển thị tóm tắt căn hộ và khoản tiền đặt cọc 200 triệu đồng.
   - Bộ chọn 3 màu mực ký: Xanh CĐT Novaland (`#2563eb`), Đen chuẩn mực (`#1e293b`), Đỏ niêm phong (`#dc2626`).
   - Canvas cảm ứng hỗ trợ cả chuột (mouse) và ngón tay cảm ứng (touch events).
   - Nút **"Xem HĐ"** mở bản hợp đồng A4 hoàn chỉnh. Nút **"Xóa Lại"** và nút **"Ký & Gửi / Lưu Offline"**.
3. **Tab 3: Công Cụ Thực Địa (`activeAppTab === 'tools'`)**:
   - **GPS Check-in**: Hiển thị tọa độ vĩ độ 10.8231° N, kinh độ 106.6297° E, bán kính hợp lệ Geofence 12m quanh công trường dự án. Nút ghi nhận check-in vị trí.
   - **Quét Thẻ CCCD eKYC**: Mở ống kính camera giả lập quét mã QR thẻ căn cước.
   - **Ghi Âm Đàm Phán Thoại (Voice Memo)**: Bấm ghi âm cuộc gặp với khách hàng, hiển thị đồng hồ đếm giây nhảy thời gian thực và lưu file audio note vào Sync Queue.
4. **Tab 4: Bản Tin Sàn & Thông Báo Đẩy (`activeAppTab === 'notifications'`)**:
   - Danh sách bản tin từ ban giám đốc sàn. Phân loại theo nhãn Khẩn cấp, Thưởng nóng, Sự kiện.
   - Nút **"Thử Chuông"** kích hoạt Web Audio chime test. Chạm vào tin để đánh dấu đã đọc.

### 3.4 Bảng Điều Khiển Trung Tâm Chỉ Huy (Manager Command Center)
Nằm ở cột phải dành cho cấp Quản lý Sàn / Admin:
* **Panel 1: Offline-First Engine & Sync Queue**:
   - Công tắc chuyển đổi Mất sóng (Offline Switch).
   - Danh sách chi tiết các item trong hàng đợi với icon nhận diện hành động.
   - Nút **"Đẩy Lên Server"** (Force Push All) kích hoạt tiến trình nạp dữ liệu.
   - Nút **"Payload JSON"** mở modal soi cấu trúc gói tin.
* **Panel 2: Push Notification Broadcaster**:
   - 3 Nút mẫu sự kiện nhanh: Bung hàng gấp, Thưởng nóng 50Tr, Lịch xe đưa đón.
   - Form nhập tiêu đề, nội dung và chọn nhóm chuyên viên tiếp nhận (Toàn bộ 142 Sale, Team Q1, Team Aqua City, Team NovaWorld).
   - Nút **"Bắn Thông Báo Ngay"** kích hoạt chuông và đẩy banner xuống iPhone!
   - Nút **"Hẹn Giờ Bắn Tin"** mở Modal 5.
* **Panel 3: Giám Sát Đội Ngũ Thực Địa (Live Field Agent Tracking)**:
   - Theo dõi 5 chuyên viên thực địa: Tên, vai trò, dự án đang phụ trách, tỷ lệ % pin điện thoại, tình trạng tác nghiệp (Đang dẫn khách VIP, Chuẩn bị ký cọc...).
   - Nút **"Gọi"** kích hoạt cuộc gọi thoại VoIP nhanh.

### 3.5 Danh Sách 5 Modals Nghiệp Vụ Tương Tác Sâu (Zero Dead Buttons)
1. **Modal 1: Xem Thỏa Thuận Đặt Cọc Điện Tử A4 (`selectedContractToPreview`)**:
   - Hiển thị mẫu thỏa thuận đặt cọc chuẩn CĐT Novaland có Quốc hiệu, thông tin Bên A, Bên B (Nguyễn Văn Tuấn), mã căn AQC-PH-102 và số tiền cọc 200 triệu đồng.
   - Dấu mộc đỏ điện tử của CĐT và chữ ký tay mềm mại của khách hàng.
   - Thông tin xác thực: Tọa độ GPS ký, dấu mộc thời gian và chuỗi mã băm bảo mật SHA-256. Nút tải file PDF ký số.
2. **Modal 2: Cài Đặt PWA Mobile QR Code (`showPwaInstallModal`)**:
   - Hiển thị mã QR Code lớn để quét bằng camera smartphone thật mở URL PWA.
   - Hướng dẫn 4 bước Add to Home Screen cho Safari iOS và Chrome Android.
   - Nút sao chép đường dẫn PWA.
3. **Modal 3: Ống Kính Quét CCCD Gắn Chip eKYC (`showScanIdModal`)**:
   - Giao diện camera giả lập với khung ngắm bo tròn, đường tia laser quét màu xanh lá cây chuyển động liên tục.
   - Tự động trích xuất thông tin OCR: Họ tên, số CCCD, ngày sinh, địa chỉ thường trú và nút **"Nhập Vào Hồ Sơ Khách"**.
4. **Modal 4: Chi Tiết Gói Tin Hàng Đợi Đồng Bộ (`selectedQueueItemModal`)**:
   - Hiển thị cấu trúc Payload JSON kỹ thuật sẵn sàng gửi lên máy chủ API.
   - Nút **"Ép Đồng Bộ Ngay"** và **"Xóa Khỏi Queue"**.
5. **Modal 5: Lập Lịch Hẹn Giờ Bắn Push Notification (`showScheduleNotifModal`)**:
   - Chọn thời điểm phát sóng tự động bằng picker ngày giờ.
   - Nhập tiêu đề thông báo hẹn giờ và nút **"Lưu Lịch Phát Sóng"**.

### 3.6 Xuất Khẩu Báo Cáo Kiểm Toán CSV Chuẩn UTF-8 BOM
* Nút **Xuất Nhật Ký (.CSV)** sử dụng ký tự `\uFEFF` ở đầu file, xuất toàn bộ dữ liệu hàng đợi ngoại tuyến, lịch sử check-in GPS và nhật ký chữ ký điện tử mà không bị lỗi font tiếng Việt trên Microsoft Excel.

---

## 4. Ma Trận Kiểm Thử Nghiệp Vụ Chi Tiết (8/8 Test Matrix - PASS)

| Test ID | Kịch Bản Kiểm Thử | Dữ Liệu Đầu Vào | Các Bước Thực Hiện | Kết Quả Kỳ Vọng | Trạng Thái |
|:---|:---|:---|:---|:---|:---:|
| **TC-MOB-01** | Bật/Tắt Giả Lập Mất Mạng (Offline Switch) | Click công tắc mạng | Gạt công tắc sang trạng thái Offline | Thanh Status Bar iPhone chuyển sang màu đỏ, hiện icon WifiOff, toast thông báo Offline-first | **PASS** |
| **TC-MOB-02** | Ký Tên HĐ Cọc Khi Mất Mạng | Chọn mực xanh, vẽ chữ ký trên Canvas | Nhấp nút "Lưu Offline" | Chữ ký được lưu, xuất hiện ngay 1 task mới trong Sync Queue với badge thời gian | **PASS** |
| **TC-MOB-03** | Tự Động Đồng Bộ Khi Có Mạng Lại | Bật lại công tắc sang Online | Gạt công tắc sang Online khi có task trong Queue | Xuất hiện spinner xoay, thanh tiến độ đồng bộ đẩy hết các task lên server, Queue về 0 | **PASS** |
| **TC-MOB-04** | Bắn Push Notification Broadcast | Nhập tiêu đề & bấm "Bắn thông báo ngay" | Nhấp nút Bắn thông báo | Phát chuông "Ting-ting" Web Audio, banner thông báo iOS trượt từ Dynamic Island xuống | **PASS** |
| **TC-MOB-05** | Khóa Căn Khẩn Cấp 15 Phút Thực Địa | Chọn căn AQC-PH-102 trạng thái Trống | Nhấp nút "Khóa 15p" trong tab Rổ Hàng | Ghi nhận task khóa căn vào Sync Queue, hiển thị toast giữ chỗ thành công | **PASS** |
| **TC-MOB-06** | Quét Thẻ CCCD Gắn Chip eKYC | Nhấp nút "Bật Camera Quét CCCD" | Mở Modal 3, camera quét tia laser xanh | Hiển thị thông tin OCR trích xuất chính xác, bấm "Nhập Vào Hồ Sơ" thành công | **PASS** |
| **TC-MOB-07** | Xem Thỏa Thuận Cọc Kèm Chữ Ký A4 | Nhấp nút "Xem HĐ" tại Tab Ký tên | Mở Modal 1 Preview HĐ Cọc | Hiển thị văn bản A4 hoàn chỉnh, chữ ký số, mộc thời gian GPS và mã băm SHA-256 | **PASS** |
| **TC-MOB-08** | Xuất Báo Cáo Kiểm Toán CSV UTF-8 | Nhấp nút "Xuất Nhật Ký (.CSV)" | Kích hoạt `handleExportCSV` | Tải về file `NhatKy_DongBo_ThucDia_PWA_*.csv`, mở trên Excel chuẩn font tiếng Việt | **PASS** |

---

## 5. Hướng Dẫn Vận Hành Dành Cho Chuyên Viên & Ban Điều Hành Sàn

### 5.1 Quy Trình Tác Nghiệp Khóa Căn Ngoại Tuyến Tại Thực Địa
1. **Trước khi xuất phát đi công trường**: Mở PWA để hệ thống tự động tải giỏ hàng mới nhất và bộ nhớ đệm Sales Kit về máy.
2. **Tại hiện trường mất sóng**:
   - Mở tab **Rổ Hàng** để kiểm tra vị trí căn hộ và giá niêm yết.
   - Khi khách hàng chốt căn, bấm **"Khóa 15p"** để đăng ký quyền ưu tiên.
   - Mở tab **Ký HĐ Cọc**, cho khách hàng ký ngón tay trực tiếp trên màn hình điện thoại.
   - Mở tab **Thực Địa**, bấm **"Check-in Vị Trí"** để lưu tọa độ GPS của buổi tiếp khách.
3. **Khi trở lại khu vực có sóng**: Hệ thống sẽ tự động đồng bộ toàn bộ dữ liệu lên máy chủ và kích hoạt quy trình phê duyệt cọc ở cấp Quản lý sàn.
