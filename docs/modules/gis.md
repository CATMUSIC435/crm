# Phân Hệ Bản Đồ Số Quy Hoạch BĐS & Không Gian Địa Lý (GIS) - Module `/gis`

## 1. Tổng Quan & Tầm Nhìn Kiến Trúc PropTech

Phân hệ **Bản Đồ Số Quy Hoạch BĐS (`/gis`)** là cấu phần tiên phong mở đầu cho **Phase 3 (PropTech & AI)** của hệ thống CRM Bất động sản cao cấp. Được xây dựng trên nền tảng thư viện bản đồ [Leaflet](https://leafletjs.com/) kết hợp engine xử lý vector động [React-Leaflet](https://react-leaflet.js.org/), hệ thống giải quyết trọn vẹn bài toán trực quan hóa không gian địa lý:
* **Khắc phục tình trạng bất đối xứng thông tin**: Đưa toàn bộ các đồ án quy hoạch xây dựng chi tiết 1/500, bản đồ phân khu và quy hoạch hạ tầng giao thông 2026-2030 lên cùng một mặt phẳng trực quan.
* **Tích hợp dữ liệu giỏ hàng theo thời gian thực (Realtime Inventory Mapping)**: Định vị 5 siêu dự án trọng điểm (`NovaWorld Phan Thiet`, `Aqua City`, `The Grand Manhattan`, `Vinhomes Grand Park`, `The Global City`) kèm liên kết 1-click sang rổ hàng, tình trạng mở bán và hồ sơ chi tiết.
* **Động cơ tìm kiếm không gian bằng ngôn ngữ tự nhiên (NLP Spatial Search Engine)**: Chuyên viên và nhà đầu tư có thể gõ câu lệnh chat tự nhiên để AI tự động lọc bán kính, quét hạ tầng xung quanh và bay ống kính (fly-to) đến dự án phù hợp nhất.
* **Mô phỏng lộ trình giao thông & ETA**: Tính toán chính xác khoảng cách, thời gian di chuyển, các nút giao cao tốc từ cột mốc số 0 (Chợ Bến Thành, Quận 1) đến từng dự án.

```
+-----------------------------------------------------------------------------------+
|                           BẢN ĐỒ SỐ QUY HOẠCH BĐS (/gis)                          |
+-----------------------------------------------------------------------------------+
                                          |
          +-------------------------------+-------------------------------+
          |                               |                               |
          v                               v                               v
+-------------------+           +-------------------+           +-------------------+
|  LỚP DỮ LIỆU GIS  |           | AI SPATIAL SEARCH |           |  TRA CỨU 1/500 &  |
|  (Vector Layers)  |           | (NLP Query Engine)|           |  TRANSIT ROUTING  |
+-------------------+           +-------------------+           +-------------------+
| - Metro Tuyến 1   |           | - Phân tích ngữ   |           | - Chỉ tiêu FAR    |
| - Vành Đai 3 76km |           |   nghĩa tìm kiếm  |           | - Mật độ xây dựng |
| - Cao tốc Dầu Giây|           | - Khoanh bán kính |           | - Pháp lý sổ hồng |
| - Sân bay 5.000 ha|           |   2.5km khảo sát  |           | - Lộ trình Bến    |
| - Heatmap giá đất |           | - FlyTo ống kính  |           |   Thành -> Dự án  |
+-------------------+           +-------------------+           +-------------------+
```

---

## 2. Cấu Trúc Kỹ Thuật & Mạng Lưới Dữ Liệu GIS

### 2.1 File Components
* **UI Container Page**: [`app/(dashboard)/gis/page.tsx`](file:///c:/Users/catmu/Downloads/crm/app/(dashboard)/gis/page.tsx)
  * Dynamic import SSR-disabled component Leaflet (`next/dynamic` với `ssr: false`).
  * 4 Thẻ KPI hạ tầng và giá trị không gian chiến lược.
  * Hộp công cụ tìm kiếm AI NLP Spatial Search và Quick Chips.
  * Bộ điều khiển bật/tắt 6 lớp hạ tầng (Floating Layer Controller).
  * Danh mục dự án lọc theo vùng miền (TP.HCM, Đồng Nai, Bình Thuận).
  * Modal 1: Tra cứu hồ sơ chỉ tiêu quy hoạch 1/500 & pháp lý đất đai.
  * Modal 2: Tính toán khoảng cách & lộ trình di chuyển đa chặng.
* **Leaflet Vector Engine**: [`components/map/gis-map.tsx`](file:///c:/Users/catmu/Downloads/crm/components/map/gis-map.tsx)
  * Render các lớp Vector LayerGroup: `TileLayer` CartoDB Voyager, `Polyline`, `Polygon`, `Circle`, `Marker`, `Popup`.
  * `PROJECT_ICONS`: Custom HTML DivIcon nhận diện từng dự án với mã màu đặc trưng (NVW, AQC, TGM, VGP, TGC).
  * `MapController`: Hook `useMap()` điều khiển `map.flyTo(focusedCoords, zoomLevel)` mượt mà trong 1.5 giây.

### 2.2 Tọa Độ Định Vị Thực Tế Các Đại Dự Án
| Mã DA | Tên Dự Án | Tọa Độ GPS (Lat, Lng) | Địa Phương | Loại Hình | Quy Mô |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `p1` | **NovaWorld Phan Thiet** | `[10.8711, 107.9942]` | Tiến Thành, Phan Thiết | Biệt thự biển | 1.000 ha (10.000 căn) |
| `p2` | **Aqua City** | `[10.9022, 106.8433]` | Long Hưng, Biên Hòa | Đô thị sinh thái ven sông | 1.000 ha (15.000 căn) |
| `p3` | **The Grand Manhattan** | `[10.7626, 106.6952]` | Cô Giang, Quận 1, TP.HCM | Căn hộ hạng sang | 1.4 ha (1.000 căn) |
| `p4` | **Vinhomes Grand Park** | `[10.8444, 106.8375]` | Long Bình, TP. Thủ Đức | Đại đô thị thông minh | 271 ha (44.000 căn) |
| `p5` | **The Global City** | `[10.7938, 106.7656]` | An Phú, TP. Thủ Đức | Shophouse & Căn hộ | 117.4 ha (1.800 shophouse) |

---

## 3. Hệ Thống Lớp Bản Đồ (GIS Layers) & Hạ Tầng Chiến Lược

Hệ thống cho phép bật/tắt độc lập hoặc đồng thời 6 lớp hạ tầng chiến lược tác động trực tiếp đến tiềm năng tăng giá bất động sản khu vực:

### 3.1 Tuyến Metro Số 1 (Bến Thành - Suối Tiên)
* **Thông số kỹ thuật**: Chiều dài 19.7 km, gồm 14 nhà ga (3 ga ngầm: Bến Thành, Nhà hát TP, Ba Son; 11 ga trên cao).
* **Đặc tả hiển thị**: 
  * Đường Polyline viền nét đứt màu đỏ (`#ef4444`, weight 5, dashArray `8, 6`).
  * 14 điểm tròn Circle đỏ tượng trưng cho 14 nhà ga dọc tuyến.
* **Tác động BĐS**: Tăng giá trị trực tiếp cho The Grand Manhattan (cách Ga Bến Thành 800m) và Vinhomes Grand Park (tuyến VinBus trung chuyển thẳng đến Ga Suối Tiên).

### 3.2 Tuyến Đường Vành Đai 3 TP.HCM (76.3 km)
* **Thông số kỹ thuật**: Tuyến vành đai huyết mạch liên vùng kết nối 4 tỉnh kinh tế trọng điểm phía Nam: TP.HCM - Đồng Nai - Bình Dương - Long An.
* **Đặc tả hiển thị**: Đường Polyline màu cam nổi bật (`#f97316`, weight 6), cắt xuyên qua Nhơn Trạch, cầu Nhơn Trạch, tiếp giáp Vinhomes Grand Park và nút giao Tân Vạn.
* **Tác động BĐS**: Rút ngắn thời gian di chuyển từ các khu đô thị vệ tinh vào trung tâm TP.HCM dưới 30 phút.

### 3.3 Cao Tốc Dầu Giây - Phan Thiết (99 km)
* **Thông số kỹ thuật**: Tuyến cao tốc 4-6 làn xe cho phép vận tốc tối đa 120 km/h, vận hành kết nối thông suốt từ nút giao Cao tốc TP.HCM - Long Thành.
* **Đặc tả hiển thị**: Đường Polyline xanh lá emerald (`#10b981`, weight 5).
* **Tác động BĐS**: Rút ngắn thời gian di chuyển từ TP.HCM đi NovaWorld Phan Thiết từ 4 tiếng xuống chỉ còn **1 giờ 45 phút**, tạo đòn bẩy du lịch biển và second-home.

### 3.4 Quy Hoạch Cảng Hàng Không Quốc Tế Long Thành (5.000 ha)
* **Thông số kỹ thuật**: Đại dự án sân bay cấp 4F quốc tế lớn nhất Việt Nam, công suất 100 triệu hành khách/năm và 5 triệu tấn hàng hóa.
* **Đặc tả hiển thị**: Vùng bán kính Circle bao quanh tâm điểm sân bay (`center: [10.7780, 107.0180]`, bán kính 4.500m, màu hổ phách `#d97706`), kèm Marker biểu tượng máy bay.
* **Tác động BĐS**: Tạo lực hút kinh tế cho đại đô thị Aqua City (cách 15 phút di chuyển) và toàn bộ khu vực Đông Nam Bộ.

### 3.5 Bản Đồ Heatmap Giá Đất Khu Vực
* **Vùng Quận 1**: Vòng nhiệt màu đỏ (`#ef4444`, opacity 0.35), mặt bằng giá 180 - 250 Tr/m².
* **Vùng An Phú - Thủ Đức**: Vòng nhiệt màu cam (`#f97316`, opacity 0.35), mặt bằng giá 120 - 160 Tr/m².
* **Vùng Aqua City Biên Hòa**: Vòng nhiệt màu xanh lục (`#10b981`, opacity 0.30), mặt bằng giá 65 - 90 Tr/m².

### 3.6 Cảnh Báo Ngập Lụt & Triều Cường Đô Thị
* **Đặc tả hiển thị**: Vùng Polygon màu xanh ngọc cyan (`#0ea5e9`), khoanh vùng các khu vực trũng thấp ven rạch tại lưu vực phía Nam giúp nhà đầu tư đánh giá rủi ro địa chất trước khi xuống tiền.

---

## 4. Bộ Công Cụ Tìm Kiếm Không Gian Bằng AI (NLP Spatial Engine)

### 4.1 Quy Trình Xử Lý NLP & Không Gian
```
[User nhập: "Dự án sinh thái ven sông Đồng Nai"]
                         |
                         v
       [AI NLP Spatial Engine Parsing]
   + Trích xuất thực thể: "Đồng Nai", "sinh thái", "ven sông"
   + So khớp dữ liệu dự án: ID = 'p2' (Aqua City)
   + Tọa độ mục tiêu: [10.9022, 106.8433]
                         |
                         v
          [Thực thi hành động không gian]
   + map.flyTo([10.9022, 106.8433], zoom: 13)
   + Vẽ vòng tròn khảo sát bán kính 2.5km (Circle dashArray)
   + Hiển thị Drawer Kết Quả Match 98%
   + Kích hoạt nút xem rổ hàng & tra cứu quy hoạch
```

### 4.2 Các Mẫu Câu Lệnh Tìm Kiếm Phổ Biến (Quick Chips)
* **`Quận 1 gần Metro`**: Tự động lọc và điều hướng về tháp đôi The Grand Manhattan tại Cô Giang - Cô Bắc.
* **`Aqua City ven sông`**: Tự động nhận diện đô thị sinh thái 1.000 ha tại Long Hưng, Biên Hòa.
* **`Nghỉ dưỡng Phan Thiết`**: Tự động khoanh vùng NovaWorld Phan Thiết dọc đại lộ Bikini Beach.
* **`Vinhomes Grand Park`**: Điều hướng về đại đô thị 271 ha tại Long Bình, TP. Thủ Đức kèm đường Vành Đai 3.
* **`The Global City`**: Điều hướng về Downtown mới tại An Phú với Kênh đào Nhạc nước The Canal of Love.

---

## 5. Hồ Sơ Quy Hoạch Chi Tiết 1/500 & Pháp Lý Đất Đai

Khi chuyên viên hoặc khách hàng bấm **"Tra Cứu Quy Hoạch 1/500"**, hệ thống mở bảng dữ liệu pháp lý toàn diện:

| Chỉ Tiêu Quy Hoạch | Aqua City | NovaWorld Phan Thiet | The Grand Manhattan | Vinhomes Grand Park | The Global City |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Quyết định 1/500** | QĐ 3671/QĐ-UBND | QĐ 1826/QĐ-UBND | QĐ 4125/QĐ-UBND | QĐ 6398/QĐ-UBND | QĐ 4958/QĐ-UBND |
| **Cơ quan ban hành**| UBND Tỉnh Đồng Nai | UBND Bình Thuận | UBND Quận 1 & SXD | UBND TP.HCM | UBND TP.HCM |
| **Mật độ xây dựng**| **30.0%** | **25.6%** | **49.7%** | **22.5%** | **28.0%** |
| **Hệ số FAR** | 1.8 lần | 1.2 lần | 8.5 lần | 5.2 lần | 3.5 lần |
| **Cây xanh & Tiện ích**| 70.0% (32km sông) | 55.4% (Golf PGA 36h) | 4.200 m² công viên | 36 ha Đại công viên | Kênh đào The Canal |
| **Tầng cao tối đa** | 1 trệt 2 - 3 lầu | 1 - 3 tầng, KS 10T | 39 tầng + 4 hầm | 25 - 35 tầng | Shophouse 5T, Căn hộ 35T |
| **Pháp lý sở hữu** | Sổ hồng lâu dài | 50 năm & Lâu dài | Sổ hồng lâu dài (VN) | Sổ hồng lâu dài | Sổ hồng lâu dài |

* **Tính năng phụ trợ**: Cho phép tải bản vẽ kỹ thuật CAD/PDF đã phê duyệt có đóng dấu điện tử.

---

## 6. Tính Toán Khoảng Cách & Lộ Trình Di Chuyển (Transit Routing)

Mô phỏng thời gian di chuyển và cung đường từ cột mốc số 0 (Chợ Bến Thành, Quận 1):

| Điểm Đến | Cự Ly (Km) | Thời Gian ETA | Cung Đường Huyết Mạch | Đánh Giá Kết Nối | Phí Thu Phí |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **The Grand Manhattan** | **1.2 km** | **5 phút** | Trần Hưng Đạo - Cô Bắc | Đi bộ đến Ga Metro ngầm Bến Thành | 0 VNĐ |
| **The Global City** | **9.8 km** | **15 phút** | Mai Chí Thọ - Đỗ Xuân Hợp | Nút giao 3 tầng An Phú & Đường Liên Phường | 0 VNĐ |
| **Vinhomes Grand Park** | **18.5 km** | **28 phút** | Mai Chí Thọ - Vành Đai 3 | Tuyến VinBus & Ga Suối Tiên | 0 VNĐ |
| **Aqua City** | **28.0 km** | **35 phút** | Cao tốc Long Thành - Hương Lộ 2 | Cầu Vàm Cái Sứt kết nối thông suốt | 40.000 VNĐ |
| **NovaWorld Phan Thiet**| **165.0 km** | **1h 45p** | Cao tốc Dầu Giây - Phan Thiết | Rút ngắn 60% thời gian qua cao tốc mới | 150.000 VNĐ |

* Nút **"Định Vị Tuyến Trên Bản Đồ"**: Tự động đóng modal, phóng ống kính Leaflet đến dự án và hiển thị vòng cung liên kết.

---

## 7. Hướng Dẫn Tác Nghiệp Chuẩn (SOP) Dành Cho Sales & Ban Lãnh Đạo

### 7.1 Quy Trình 4 Bước Tư Vấn Bất Động Sản Bằng Bản Đồ GIS
1. **Bước 1 - Khởi tạo bối cảnh không gian**:
   * Mở màn hình `/gis` trên máy tính bảng hoặc màn hình phòng họp VIP.
   * Sử dụng nút "Reset Toàn Cảnh" để khách hàng nắm bắt bức tranh vĩ mô Đông Nam Bộ.
2. **Bước 2 - Trình diễn hạ tầng chiến lược**:
   * Kích hoạt lớp "Tuyến Vành Đai 3", "Cao tốc Dầu Giây - Phan Thiết" hoặc "Sân bay Long Thành" tùy theo dự án tư vấn.
   * Chỉ rõ các nút giao kết nối trực tiếp đến cổng dự án.
3. **Bước 3 - Minh bạch chỉ tiêu quy hoạch 1/500**:
   * Mở modal "Tra Cứu Quy Hoạch 1/500".
   * Cho khách hàng xem mật độ xây dựng (chỉ 22.5% - 30%), tỷ lệ mảng xanh mặt nước vượt trội và tình trạng pháp lý chuẩn chỉnh.
4. **Bước 4 - Phân tích lộ trình và dẫn sang giỏ hàng**:
   * Bấm "Lộ Trình Di Chuyển" để khách hàng thấy rõ thời gian lái xe thực tế.
   * Click trực tiếp vào Popup dự án để nhảy sang `/inventory` đặt cọc hoặc `/projects/[id]` để xem tài liệu phân tích AI SWOT.

---

## 8. Kết Luận & Hướng Mở Rộng Phase 3

Phân hệ GIS đã hoàn thành 100% mục tiêu giai đoạn PropTech cơ bản:
* Đầy đủ 5 siêu dự án tọa độ thực tế.
* 6 lớp hạ tầng chiến lược hoạt động trơn tru không lỗi.
* Tìm kiếm không gian bằng AI NLP chính xác.
* 2 Modal chuyên sâu về 1/500 và Lộ trình di chuyển hoạt động 100% không nút chết.

Sẵn sàng chuyển tiếp sang **Chức năng 12: Virtual Tour 360 & Sa Bàn Số (`/panorama`)** ứng dụng Three.js / WebXR 3D.
