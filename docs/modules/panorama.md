# Phân Hệ Virtual Tour 360 & Sa Bàn Số 3D - Module `/panorama`

## 1. Tổng Quan & Tầm Nhìn Kiến Trúc PropTech

Phân hệ **Virtual Tour 360 & Sa Bàn Số 3D (`/panorama`)** là cấu phần công nghệ thị giác cốt lõi trong **Giai đoạn 3 (PropTech & AI)** của hệ thống CRM Bất động sản cao cấp. Được xây dựng trực tiếp trên nền tảng WebGL thông qua hệ sinh thái [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) và [@react-three/drei](https://github.com/pmndrs/drei), giải pháp đem đến trải nghiệm tham quan không gian thực tế ảo chân thực:

* **Tối ưu hóa tỷ lệ chốt deal từ xa (Remote Closing Rate)**: Khách hàng thượng lưu, Việt kiều và nhà đầu tư ở xa có thể tham quan từng góc phòng căn hộ mẫu, bước ra ban công ngắm biển hay kiểm tra chi tiết thiết bị bàn giao như đang có mặt thực tế tại dự án.
* **Cắt giảm chi phí làm nhà mẫu & sa bàn vật lý**: Tiết kiệm hàng chục tỷ đồng chi phí chế tác sa bàn cơ học cồng kềnh, dễ dàng cập nhật tình trạng bán và quy hoạch phân khu theo thời gian thực.
* **Tích hợp giao dịch thương mại tức thì**: Không chỉ dừng lại ở việc xem ảnh 360 tĩnh, hệ thống cho phép khách hàng **Giữ căn & Khóa chỗ tức thì (`Booking`)**, tải bản vẽ mặt bằng kiến trúc, và kích hoạt cuộc gọi video tư vấn 1-1 với chuyên viên đồng bộ góc nhìn thời gian thực (**Co-browsing**).

```
+-----------------------------------------------------------------------------------+
|                   VIRTUAL TOUR 360° & SA BÀN SỐ 3D (/panorama)                    |
+-----------------------------------------------------------------------------------+
                                          |
          +-------------------------------+-------------------------------+
          |                               |                               |
          v                               v                               v
+-------------------+           +-------------------+           +-------------------+
|  CĂN HỘ MẪU 360°  |           |  SA BÀN SỐ 3D     |           | CÔNG CỤ TÁC NGHIỆP|
|  (VR360 Tour)     |           | (Master Plan 3D)  |           | & KHÓA CHỖ TỨC THÌ|
+-------------------+           +-------------------+           +-------------------+
| - 3D Room Portals |           | - 3D Massing Khối |           | - Thước đo Laser  |
| - Môi trường HDRI |           | - Tỷ lệ tiêu thụ  |           | - Tra cứu vật liệu|
| - Ngày / Đêm Mode |           | - Giá rumor theo  |           | - Web Audio Sóng  |
| - MiniMap Radar 2D|           |   từng phân khu   |           | - Đặt cọc 100Tr   |
| - 4 Đại dự án mẫu |           | - 1-Click vào Tour|           | - Video Co-browse |
+-------------------+           +-------------------+           +-------------------+
```

---

## 2. Cấu Trúc Kỹ Thuật & Công Nghệ Đồ Họa 3D

### 2.1 File Components
* **Giao diện điều khiển & Trình quản trị Tour**: [`app/(dashboard)/panorama/page.tsx`](file:///c:/Users/catmu/Downloads/crm/app/(dashboard)/panorama/page.tsx)
  * Dynamic import SSR-disabled component Three.js (`next/dynamic` với `ssr: false`).
  * Thanh chọn dự án và chuyển đổi chế độ kép: **Căn Hộ Mẫu 360°** vs **Sa Bàn Ảo 3D**.
  * Dải băng chọn phòng (Room Ribbon) với ảnh thumbnail sắc nét và thông số diện tích.
  * Bộ công cụ nổi: Thước đo laser, Bật/tắt ghi chú vật liệu, Ngày/Đêm, Âm thanh thiên nhiên, Tự động quay và Toàn màn hình.
  * 5 Modal nghiệp vụ chuyên sâu: Giữ chỗ căn hộ, Chia sẻ mã QR & link Zalo, Chi tiết vật liệu bàn giao, Video call tư vấn 1-1 (Co-browsing) và Chi tiết phân khu sa bàn.
* **Engine Thực Tế Ảo 3D Three.js**: [`components/3d/panorama-viewer.tsx`](file:///c:/Users/catmu/Downloads/crm/components/3d/panorama-viewer.tsx)
  * Render Canvas Three.js tích hợp `XR` store cho kính thực tế ảo WebXR.
  * Môi trường ánh sáng HDRI linh hoạt thông qua `Environment preset` (`apartment`, `sunset`, `city`, `night`, `lobby`, `forest`, `park`, `dawn`).
  * `RoomPortalHotspot`: Điểm dịch chuyển không gian 3D tương tác chuột/chạm.
  * `SpecHotspot`: Điểm ghim vật liệu bàn giao với hiệu ứng nhấp nháy phát sáng.
  * `LaserRuler3D`: Thước đo laser 3D đo đạc bề ngang, chiều cao trần và diện tích sàn.
  * `MiniMapRadar`: Radar 2D ở góc màn hình tính toán góc xoay azimuth của camera qua hook `useFrame()` để xoay hình quạt FoV tương ứng.
  * `DigitalMasterPlan3D`: Sa bàn số 3D với mô hình phân khu, mảng xanh, mặt nước và bảng ghim trạng thái bán hàng.
  * Bộ tổng hợp âm thanh thiên nhiên bằng Web Audio API (Native Ocean Breeze Synthesizer - không phụ thuộc file mp3 ngoài).

---

## 3. Danh Mục Dự Án Mẫu & Không Gian Trải Nghiệm Thực Tế

Hệ thống cấu hình sẵn 4 đại dự án tiêu biểu đại diện cho các phân khúc bất động sản cao cấp:

### 3.1 NovaWorld Phan Thiet (`p1`) - Biệt Thự Biển Đơn Lập Florida
* **Mã căn**: `NVW-01.01` | **Diện tích**: 250 m² | **Giá niêm yết**: 25.0 Tỷ VNĐ | **Hướng**: Đông Nam trực diện biển.
* **Các không gian 360°**:
  1. `Phòng Khách Panorama` (58.0 m², trần cao 3.60m, preset `apartment`): Sàn đá Marble tự nhiên Carrara White nhập khẩu Ý, kính Low-E 3 lớp cản nhiệt 99%.
  2. `Ban Công Hoàng Hôn Bikini Beach` (24.0 m², preset `sunset`): Lan can kính cường lực tràn viền 19mm ngắm hoàng hôn vịnh biển.
  3. `Phòng Ngủ Master King Suite` (38.0 m², preset `lobby`): Hệ thống Smart Home Lumi điều khiển rèm và ánh sáng bằng giọng nói.
  4. `Hồ Bơi Vô Cực & Vườn Riêng` (95.0 m², preset `park`): Hệ thống lọc nước điện phân muối khoáng AstralPool Tây Ban Nha.
* **Các phân khu Sa Bàn Số 3D**:
  * Phân khu Florida 1 (1.200 căn, đã bán 85%, giá từ 16 Tỷ).
  * Phân khu Waikiki (270 căn đồi giật cấp, đã bán 92%, giá từ 22 Tỷ).
  * Phân khu PGA Golf Villas (500 căn, đã bán 78%, giá từ 19 Tỷ).
  * Tổ hợp Bikini Beach & Circus Land 16ha (Đang vận hành).

### 3.2 The Grand Manhattan (`p3`) - Sky Mansion Penthouse Quận 1
* **Mã căn**: `TGM-38.01` | **Diện tích**: 165 m² | **Giá niêm yết**: 32.0 Tỷ VNĐ | **Hướng**: Đông Nam view Bitexco & Sông Sài Gòn.
* **Các không gian 360°**:
  1. `Đại Sảnh Phòng Khách Sky Mansion` (68.0 m², trần cao 3.80m, preset `city`): Khóa thông minh Hafele FaceID 3D của Đức.
  2. `Ban Công Triệu Đô Ban Đêm` (22.0 m², preset `night`): Tầm view triệu đô ngắm toàn cảnh Sài Gòn rực rỡ ánh đèn đêm.
  3. `Phòng Ngủ Master Tổng Thống` (42.0 m², preset `lobby`): Thiết bị vệ sinh Duravit Philippe Starck mạ PVD cao cấp.
* **Các phân khu Sa Bàn Số 3D**:
  * Khối Khách Sạn 5* Avani Saigon (Tầng 1 - 7).
  * Tháp Căn Hộ Hạng Sang Manhattan 39 Tầng (1.000 căn, đã bán 80%).
  * Tổ hợp Tiện ích Resort Tầng 3 (4.200 m²).
  * Hầm đỗ xe thông minh 4 tầng định danh riêng cho cư dân.

### 3.3 Aqua City (`p2`) - Dinh Thự Đảo Phượng Hoàng (Phoenix South)
* **Mã căn**: `AQC-PH.08` | **Diện tích**: 350 m² | **Giá niêm yết**: 28.5 Tỷ VNĐ | **Hướng**: Nam view Sông Đồng Nai.
* **Các không gian 360°**:
  1. `Phòng Khách Sinh Thái Tràn Kính` (72.0 m², trần cao 4.20m, preset `forest`): Điện mặt trời áp mái Solar Roof của SMA Đức.
  2. `Bến Du Thuyền Riêng Tại Gia` (45.0 m², preset `dawn`): Cầu tàu neo đậu du thuyền cá nhân chuẩn Marinetek Phần Lan.
* **Các phân khu Sa Bàn Số 3D**:
  * Đảo Phượng Hoàng (286 ha nguyên sinh, đã bán 88%, giá từ 18 Tỷ).
  * Quảng trường Aqua Marina 5ha (Đã bán 95%, giá từ 35 Tỷ).
  * Khu đô thị thương mại The Sun (1.800 căn, đã bán 90%).

### 3.4 The Global City (`p5`) - Shophouse SOHO Thương Mại 5 Tầng
* **Mã căn**: `TGC-SH.12` | **Diện tích**: 380 m² | **Giá niêm yết**: 38.0 Tỷ VNĐ | **Hướng**: Bắc mặt tiền Đỗ Xuân Hợp.
* **Các không gian 360°**:
  1. `Tầng Trệt Kinh Doanh Flagship` (85.0 m², trần cao 4.50m, preset `city`): Mặt kính tràn kiến trúc Foster + Partners Anh Quốc.
  2. `Rooftop Lounge Kênh Đào Nhạc Nước` (65.0 m², preset `sunset`): View trực diện kênh đào The Canal of Love lớn nhất Đông Nam Á.
* **Các phân khu Sa Bàn Số 3D**:
  * Khu Shophouse SOHO (915 căn, đã bán 92%).
  * Kênh đào Nhạc nước The Canal of Love.
  * Khu phức hợp căn hộ cao tầng Foster + Partners (8.000 căn).

---

## 4. Hệ Thống Công Cụ Tác Nghiệp Không Gian 3D

| Công Cụ | Phím / Thao Tác | Cơ Chế Hoạt Động & Giá Trị Nghiệp Vụ |
| :--- | :--- | :--- |
| **Thước Đo Laser 3D** | Nút `Ruler` trên toolbar | Kích hoạt đường tia laser xanh dạ quang trong không gian Three.js, hiển thị nhãn số đo thực tế: Bề ngang (m), Chiều cao trần (m), Diện tích phòng (m²). |
| **Ghi Chú Vật Liệu** | Nút `Sparkles` trên toolbar | Hiển thị các chấm sáng phát quang tại vị trí vật liệu (Đá Marble, Kính Low-E, Smart Home). Bấm vào mở thẻ kiểm định thương hiệu, xuất xứ và thời hạn bảo hành. |
| **Chế Độ Ngày / Đêm** | Nút `Moon / Sun` | Chuyển đổi môi trường ánh sáng HDRI giữa ban ngày rực rỡ (`apartment/city`) và hoàng hôn/ban đêm lung linh (`sunset/night`). |
| **Âm Thanh Môi Trường** | Nút `Volume` | Khởi tạo Web Audio API AudioContext tạo hiệu ứng tiếng sóng biển rì rào hoặc gió thoảng chân thực, giúp khách hàng thư giãn khi xem nhà mẫu. |
| **Tự Động Quay 360°** | Nút `RotateCw` | Kích hoạt `autoRotate` của OrbitControls với tốc độ 0.8 rad/s, giúp trình diễn tour tự động trên màn hình lớn phòng họp VIP hoặc iPad. |
| **Radar MiniMap 2D** | Tự động ở góc trái dưới | Phân tích góc xoay camera qua hook `useFrame()`, xoay hình nón quét (FoV) trên sơ đồ mặt bằng căn hộ thời gian thực. |
| **Toàn Màn Hình** | Nút `Maximize2` | Mở rộng khung nhìn toàn màn hình (`fixed inset-0 z-[100]`) tối ưu hóa trải nghiệm không bị phân tâm. |

---

## 5. Quy Trình Tác Nghiệp Thương Mại (Zero Dead Buttons)

### 5.1 Đặt Cọc & Khóa Căn Tức Thì (Instant Booking)
* Bấm nút **"Giữ Căn Ngay ({Mã căn})"**: Mở modal đặt cọc nhanh.
* Tự động điền thông tin dự án, mã căn, diện tích, giá bán niêm yết.
* Chọn nhanh khách hàng từ danh bạ VVIP (`c1` - `c8`) hoặc nhập mới, chọn số tiền cọc (100Tr hoặc 200Tr).
* Khi xác nhận: Tự động gọi action `addBookingTicket` của Zustand Store, sinh mã phiếu `BK-VR-xxxx`, cập nhật trạng thái rổ hàng sang `Booking` và hiển thị banner điều hướng sang `/booking`.

### 5.2 Chia Sẻ VR Tour (Mã QR & Link Rút Gọn)
* Tạo mã QR Code chuẩn để khách quét ngay bằng camera iPhone / iPad trải nghiệm tính năng xoay theo con quay hồi chuyển (Gyroscope).
* Hỗ trợ nút sao chép link 1-click có thông báo, nút gửi qua Zalo VIP và gửi SMS Brandname.

### 5.3 Cuộc Gọi Video Tư Vấn 1-1 & Đồng Bộ Màn Hình (Co-Browsing)
* Mô phỏng kết nối cuộc gọi video chất lượng cao giữa Chuyên viên tư vấn (Lê Hoàng Anh) và Khách hàng.
* Chế độ **Co-Browsing**: Khi chuyên viên xoay góc nhìn, chuyển phòng hay bật thước đo trên màn hình của mình, góc nhìn của khách hàng sẽ được đồng bộ theo thời gian thực.

### 5.4 Tải Mặt Bằng Kiến Trúc (PDF/CAD)
* Nút tải tài liệu kích hoạt thông báo tải file bản vẽ mặt bằng kiến trúc chi tiết 1/100 chuẩn kỹ thuật.

---

## 6. Hướng Dẫn Tác Nghiệp Chuẩn (SOP) Dành Cho Chuyên Viên Sale

```
[BƯỚC 1: Khởi tạo bối cảnh bằng Sa Bàn Số 3D]
  -> Trình diễn quy mô tổng thể dự án, phân khu, vị trí bãi biển và sân golf.
  -> Cho khách hàng thấy tỷ lệ đã bán (85% - 95%) để tạo hiệu ứng khan hiếm (FOMO).

[BƯỚC 2: Bước vào Căn Hộ Mẫu 360°]
  -> Bấm vào phân khu mong muốn để nhảy thẳng vào không gian Phòng Khách căn hộ mẫu.
  -> Kích hoạt âm thanh sóng biển để khơi gợi cảm xúc nghỉ dưỡng thượng lưu.

[BƯỚC 3: Chứng minh đẳng cấp vật liệu bàn giao]
  -> Bật "Vật Liệu Bàn Giao" để khách tự tay chạm vào các điểm ghim kiểm tra nguồn gốc đá Marble Ý, kính Low-E.
  -> Bật "Thước Đo Laser" để kiểm tra chiều cao trần 3.6m - 4.2m và diện tích phòng.
  -> Chuyển sang "Chế độ Ban Đêm" để ngắm view thành phố/biển về đêm.

[BƯỚC 4: Chốt deal & Khóa căn]
  -> Bấm "Giữ Căn Ngay", chọn tên khách hàng và xác nhận cọc thiện chí 100 triệu.
  -> Gửi mã QR qua Zalo để khách hàng chia sẻ cho gia đình cùng xem lại trên điện thoại.
```

---

## 7. Tiêu Chuẩn Kỹ Thuật & Tương Thích Trình Duyệt

* **WebGL 2.0**: Tương thích 100% các trình duyệt hiện đại (Chrome, Safari, Edge, Firefox).
* **WebXR Ready**: Hỗ trợ chuẩn WebXR thông qua `@react-three/xr`, sẵn sàng kết nối với kính thực tế ảo Meta Quest 3, HTC Vive và Apple Vision Pro.
* **Tối ưu hóa hiệu năng**: Dùng các preset môi trường HDRI được tối ưu từ `@react-three/drei`, kiểm soát bộ nhớ RAM dưới 150MB và duy trì tốc độ khung hình 60 FPS ổn định.
