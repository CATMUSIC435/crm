# Phân Hệ Sự Kiện Mở Bán & Check-in QR Khách VIP - Module `/events`

## 1. Tổng Quan & Tầm Nhìn Kiến Trúc Quản Lý Sự Kiện Mở Bán

Các sự kiện mở bán tập trung (Open House, Lễ ra mắt phân khu, VIP Gala Dinner) tại các khách sạn 5 sao hoặc trung tâm hội nghị quốc tế (The Reverie Saigon, Gem Center, Caravelle...) là **thời khắc quyết định chốt cọc hàng trăm căn hộ và shophouse** trong vòng 3 - 4 giờ đồng hồ. Nếu khâu tiếp đón tại sảnh lễ tân bị ùn tắc hoặc phân sai bàn tiệc cho khách hàng VVIP, trải nghiệm của giới thượng lưu sẽ bị ảnh hưởng tiêu cực.

Phân hệ **Sự Kiện Mở Bán & Check-in QR (`/events`)** là giải pháp số hóa toàn diện khâu vận hành sự kiện trực địa trong **Giai Đoạn 4: Tiếp Thị, Khách Hàng & Mạng Lưới Đối Tác**:

* **Trạm quét mã QR trực tiếp (Live Optical Scanner Station)**: Tốc độ quét dưới **0.5 giây/khách**, mô phỏng camera quang học với chùm tia laser xanh dạ quang, loại bỏ 100% tình trạng xếp hàng chờ đợi.
* **Quy trình đón tiếp khách VVIP thông minh**: Khi quét mã vé, hệ thống hiển thị tức thì popup thông tin: **Vị trí bàn tiệc danh dự**, **Số ghế ngồi chính xác**, **Chuyên viên kinh doanh trực tiếp đón tiếp**, và **Gói quà tặng tri ân (Rượu vang Pháp, Voucher 500Tr)**.
* **Sơ đồ bàn tiệc khán phòng thời gian thực (Live Banquet Seating Matrix)**: Trực quan hóa ma trận bàn tròn 10 người, theo dõi tỷ lệ lấp đầy ghế ngồi theo thời gian thực (Show-up rate).
* **Thẻ vé mời điện tử mạ vàng (Luxury E-Ticket)**: Tích hợp mã QR sắc nét, phân hạng VVIP/VIP/Tiêu chuẩn, hỗ trợ gửi 1-click qua Zalo VIP và tải file PDF.
* **Báo cáo đối soát điểm danh tự động**: Xuất dữ liệu điểm danh ra file CSV chuẩn UTF-8 phục vụ công tác kiểm toán và kế toán sự kiện.

```
+-----------------------------------------------------------------------------------+
|               SỰ KIỆN MỞ BÁN & TRẠM QUÉT QR KHÁCH VIP (/events)                   |
+-----------------------------------------------------------------------------------+
                                          |
          +-------------------------------+-------------------------------+
          |                               |                               |
          v                               v                               v
+-------------------+           +-------------------+           +-------------------+
| TRẠM QUÉT QR LIVE |           | DANH SÁCH KHÁCH   |           | SƠ ĐỒ BÀN TIỆC    |
| & POP-UP ĐÓN VVIP |           | & THẺ VÉ ĐIỆN TỬ  |           | & KHÁN PHÒNG 3D   |
+-------------------+           +-------------------+           +-------------------+
| - Laser scan 60fps|           | - Hạng vé VVIP/VIP|           | - Bàn tròn 10 ghế |
| - Quét nhanh mẫu  |           | - Thẻ vé dát vàng |           | - Bàn VVIP sân khấu|
| - Nhận diện bàn/ghế|          | - Gửi Zalo 1-click|           | - Ghế xanh / xám  |
| - In thẻ đeo tức thì|         | - Check-in thủ công|          | - Tỷ lệ lấp đầy % |
+-------------------+           +-------------------+           +-------------------+
```

---

## 2. Cấu Trúc Kỹ Thuật & Luồng Dữ Liệu (Technical Architecture)

### 2.1 File Components & Đường Dẫn
* **Giao diện điều khiển trung tâm**: [`app/(dashboard)/events/page.tsx`](file:///c:/Users/catmu/Downloads/crm/app/(dashboard)/events/page.tsx)
* **Tài liệu kỹ thuật module**: [`docs/modules/events.md`](file:///c:/Users/catmu/Downloads/crm/docs/modules/events.md)
* **Kho lưu trữ trạng thái toàn cục**: [`store/useStore.ts`](file:///c:/Users/catmu/Downloads/crm/store/useStore.ts)
* **Khai báo kiểu dữ liệu**: [`types/index.ts`](file:///c:/Users/catmu/Downloads/crm/types/index.ts)

### 2.2 Mô Hình Dữ Liệu Thực Thể (Data Models)

#### Entity `EventItem` (Sự kiện mở bán)
```typescript
export interface EventItem {
  id: string;                           // ID sự kiện duy nhất (e1, e2,...)
  title: string;                        // Tên sự kiện hiển thị
  type: string;                         // 'Open House' | 'VIP Gala Dinner' | 'Webinar' | 'Workshop'
  date: string;                         // Ngày diễn ra
  time: string;                         // Khung giờ
  location: string;                     // Địa điểm tổ chức
  registered: number;                   // Số lượng khách đăng ký
  checkedIn: number;                    // Số lượng khách đã check-in thực tế
  capacity: number;                     // Sức chứa tối đa của khán phòng
  image: string;                        // Lớp màu nhận diện (VD: bg-indigo-600)
  iconName: string;                     // Icon minh họa (Presentation, MonitorPlay, Users)
  projectId?: string;                   // Liên kết với đại dự án trong CRM
  description?: string;                 // Mô tả sự kiện
  tablesCount?: number;                 // Số lượng bàn tiệc được bố trí
}
```

#### Entity `CheckinLog` (Nhật ký quét vé thời gian thực)
```typescript
export interface CheckinLog {
  id: string;                           // ID lượt quét (cl1, cl2,...)
  eventId: string;                      // ID sự kiện liên kết
  name: string;                         // Họ tên khách hàng
  ticket: string;                       // Mã vé quét (VD: VVIP-888)
  time: string;                         // Thời điểm quét (VD: 08:15)
  status: 'VIP' | 'Standard';           // Phân hạng khách
  tableNumber?: string;                 // Số bàn tiệc được phân bổ (VD: Bàn VVIP 01)
  seatNumber?: string;                  // Số ghế ngồi (VD: Ghế A-01)
  phone?: string;                       // SĐT liên hệ
  assignedAgent?: string;               // Chuyên viên kinh doanh đón tiếp
  giftReceived?: boolean;               // Đã nhận quà tặng tri ân chưa
}
```

#### Entity `EventGuest` (Khách mời sự kiện & Vị trí ngồi)
```typescript
export interface EventGuest {
  id: string;                           // ID khách mời
  eventId: string;                      // ID sự kiện
  ticketCode: string;                   // Mã vé check-in duy nhất (VVIP-888, VIP-999)
  customerName: string;                 // Tên khách mời
  phone: string;                        // SĐT liên hệ
  email: string;                        // Email
  rank: 'VVIP' | 'VIP' | 'Tiêu Chuẩn';  // Hạng khách
  table: string;                        // Bàn tiệc (VD: Bàn VVIP 01)
  seat: string;                         // Ghế ngồi (VD: Ghế A-01)
  status: 'Đã check-in' | 'Chưa đến' | 'Hủy tham dự';
  checkinTime?: string;                 // Giờ check-in thành công
  assignedAgent: string;                // Chuyên viên phụ trách đón tiếp
  specialNotes?: string;                // Sở thích, yêu cầu phục vụ đặc biệt
  gift?: string;                        // Bộ quà tặng tương ứng với hạng vé
}
```

### 2.3 Các Actions Tương Tác Trong Zustand Store

```typescript
// Ghi nhận lượt check-in mới và tăng số lượng khách tham dự
addCheckin: (
  eventId: string, 
  ticketCode: string, 
  guestName?: string, 
  isVip?: boolean, 
  table?: string, 
  seat?: string, 
  assignedAgent?: string
) => void;

// Khởi tạo sự kiện mở bán mới
addEvent: (event: Omit<EventItem, 'id'>) => void;
```

---

## 3. Cơ Chế Hoạt Động Của Trạm Quét Vé QR Trực Tiếp

### 3.1 Khung Ngắm Quang Học (Live Viewfinder) & Tia Laser Xanh
* Giao diện mô phỏng camera 60 FPS với hiệu ứng **chùm tia laser xanh neon** quét dọc liên tục:
  $$\text{Animation: } \text{scan } 2.2s \text{ ease-in-out infinite}$$
* Khi vé được quét thành công:
  * Toàn bộ khung hình nháy sáng hiệu ứng **Flash xanh (Green Overlay Flash)** trong 1.5 giây.
  * Hiển thị biểu tượng `CheckCircle2` động xác nhận hợp lệ.
  * Đẩy bản ghi lên đầu danh sách **Lịch Sử Đón Khách Realtime** ở cột bên phải.

### 3.2 Thanh Thử Nghiệm Nhanh (Quick Sample Test Bar)
Cung cấp 4 phím tắt vé mẫu phục vụ đào tạo lễ tân và diễn tập trước giờ G:
1. `VVIP-888`: Ông Nguyễn Văn Tuấn (Bàn VVIP 01 - Ghế A-01).
2. `VIP-999`: Bà Trần Thị Bích Ngọc (Bàn VIP 02 - Ghế B-04).
3. `VIP-102`: Ông Phạm Minh Tuấn (Bàn VVIP 01 - Ghế A-02).
4. `STD-405`: Ông Đặng Quốc Huy (Bàn Standard 05 - Ghế E-03).

### 3.3 Hộp Thoại Chào Đón Khách VVIP (Welcome Modal & Badge Printing)
Kích hoạt tự động ngay sau khi quét vé thành công, cung cấp thông tin toàn diện cho lễ tân:
* **Họ tên khách hàng**: Tôn xưng trang trọng kèm huy hiệu hạng vé mạ vàng.
* **Vị trí bàn tiệc & ghế ngồi**: Nổi bật, dễ nhìn để lễ tân chỉ dẫn lối đi.
* **Chuyên viên đón tiếp**: Tên chuyên viên để lễ tân bấm thông báo nội bộ ra sảnh đón khách.
* **Đặc quyền quà tặng tri ân**: Bộ rượu vang Pháp Grand Cru, voucher chiết khấu 500 triệu.
* Nút **In Thẻ Đeo Tức Thì (Instant Badge Print)**: Kích hoạt lệnh in nhãn thẻ đeo đeo cổ cho khách.

---

## 4. Sơ Đồ Bàn Tiệc Khán Phòng & Quản Lý Chỗ Ngồi (Banquet Seating Map)

Khán phòng sự kiện được chia thành 3 phân khu chiến lược:

| Phân Khu | Số Lượng Bàn | Sức Chứa / Bàn | Vị Trí Địa Lý | Đối Tượng Khách Hàng |
| :--- | :---: | :---: | :--- | :--- |
| **Khu VVIP** | 1 Bàn (`VVIP 01`) | 10 Ghế | Ngay trước sân khấu chính | Ban Lãnh Đạo CĐT, Khách mua sỉ > 50 Tỷ |
| **Khu VIP** | 3 Bàn (`VIP 02 - 04`) | 10 Ghế | Hai cánh trung tâm sân khấu | Khách đã giữ chỗ thiện chí, khách quen |
| **Khu Phổ Thông** | 6 Bàn (`Std 05 - 10`) | 10 Ghế | Phía sau khu vực VIP | Khách mới đăng ký tham quan sa bàn |

### Cơ Chế Đo Lường Chỗ Ngồi:
Mỗi bàn tiệc được trực quan hóa bằng một hình tròn đại diện cho bàn tròn 10 người:
* Ghế màu xanh lá kèm số thứ tự: **Đã check-in có mặt tại bàn**.
* Ghế màu xám: **Còn trống (chưa đến hoặc chưa gán khách)**.
* Tự động tính tỷ lệ lấp đầy của từng bàn để ban tổ chức sắp xếp dồn bàn nếu cần thiết.

---

## 5. Thẻ Vé Mời Điện Tử Mạ Vàng (Luxury VIP E-Ticket)

Vé mời điện tử được thiết kế theo chuẩn nhận diện thương hiệu bất động sản hạng sang:
* **Tone màu chủ đạo**: Nền đen huyền bí (`slate-950`) viền ánh kim vàng hoàng gia (`amber-500`).
* **Họa tiết hoàng gia**: Huy hiệu vương miện Crown, tiêu ngữ `NOVA REAL ESTATE INVITATION`.
* **Mã QR Code Vector trung tâm**: Mã hóa chuỗi bảo mật gồm Mã sự kiện + Mã khách + Hạng vé.
* **Thao tác 1-Click**:
  * Nút **Gửi Zalo VIP**: Bắn tin nhắn Zalo kèm hình ảnh vé mời và định vị Google Maps địa điểm tổ chức.
  * Nút **Tải PDF**: Xuất file ảnh vé mời sắc nét phục vụ in thiệp giấy ép kim gửi tận nhà.

---

## 6. Quy Trình Vận Hành Tiêu Chuẩn SOP Ngày Mở Bán

```
[ Khách Đến Sảnh Lễ Tân Xuất Trình Mã QR Trên Điện Thoại ]
                             |
                             v
[ Lễ Tân Hướng Mã QR Vào Camera Trạm Quét (/events) ]
                             |
                             v (Thời gian phản hồi < 0.5s)
[ Hệ Thống Kích Hoạt Âm Thanh & Bật Pop-up Chào Đón VVIP ]
                             |
         +-------------------+-------------------+
         |                                       |
         v                                       v
[ In Thẻ Đeo Tức Thì ]              [ Thông Báo Cho Chuyên Viên
         |                            Đón Khách Qua Ứng Dụng ]
         v                                       |
[ Trao Bộ Quà Tặng Tri Ân ]                      v
         |                          [ Chuyên Viên Ra Sảnh Cúi Chào
         +-------------------+       Và Dẫn Khách Vào Đúng Bàn Tiệc ]
                             |
                             v
[ Hệ Thống Tự Động Cập Nhật Ghế Xanh Trên Sơ Đồ Bàn Tiệc Realtime ]
```

---

## 7. Tổng Kết

Phân hệ **Sự Kiện Mở Bán & Check-in QR Khách VIP (`/events`)** đã giải quyết triệt để các hạn chế của phương thức đón khách truyền thống:
1. **Nâng tầm đẳng cấp phục vụ**: Khách VIP được ghi nhận tên tuổi, sở thích và quà tặng ngay tại cửa ra vào.
2. **Loại bỏ 100% tình trạng nhầm lẫn bàn tiệc hoặc trùng ghế ngồi**.
3. **Ban lãnh đạo nắm bắt chính xác số lượng khách đang có mặt trong khán phòng từng giây**.
4. **Tạo tiền đề hoàn hảo để kích nổ cảm xúc chốt deal trong phiên mở bán chính thức**.
