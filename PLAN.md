# KẾ HOẠCH TOÀN DIỆN TRIỂN KHAI MOCK UI CHO TỪNG TRANG (NOVA CRM)

> Tài liệu này được thiết kế để theo dõi tiến độ từng trang theo dạng Checklist. Mỗi trang đều có đầy đủ mục tiêu, mô hình dữ liệu Mock, thành phần UI/UX và tiêu chuẩn nghiệm thu độc lập.

---

## 📊 TỔNG QUAN TIẾN ĐỘ THEO GIAI ĐOẠN

- [x] **Giai đoạn 1**: Chu Trình Bất Động Sản Cốt Lõi (5/5 phân hệ hoàn tất khung & dữ liệu)
- [ ] **Giai đoạn 2**: Bàn Làm Việc Theo Vai Trò & Vận Hành Đội Ngũ (0/5 trang)
- [ ] **Giai đoạn 3**: Công Nghệ Số & PropTech Tiên Phong (0/5 trang)
- [ ] **Giai đoạn 4**: Tiếp Thị, Khách Hàng & Mạng Lưới Đối Tác (1/7 trang)
- [ ] **Giai đoạn 5**: Tài Chính, Vận Hành & Nền Tảng Hệ Thống (2/10 trang)

---

## GIAI ĐOẠN 1: CHU TRÌNH GIAO DỊCH BẤT ĐỘNG SẢN CỐT LÕI
*Dòng chảy chính: Dự án ➔ Rổ hàng ➔ Khách hàng ➔ Giữ chỗ (Booking) ➔ Hợp đồng & Thanh toán.*

### 1. Rổ Hàng Trực Quan (`/inventory`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác.
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/inventory.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/inventory.md)
- **Mục tiêu**: Tra cứu mã căn theo sơ đồ phân lô, xem tình trạng hàng theo thời gian thực (Trống, Booking, Đã bán, Khóa).
- **Mock Data**: 24 sản phẩm BĐS thực tế trải dài 5 đại dự án, bổ sung hướng ban công, chính sách ưu đãi, chuyên viên giữ chỗ, thời hạn nộp cọc.
- **Thành phần UI/UX**:
  - [x] 5 Thẻ KPI & Thanh đo Tỷ lệ hấp thụ (Absorption Rate %).
  - [x] Bộ lọc đa tầng 6 chiều: Dự án, Trạng thái, Loại BĐS, Số phòng ngủ, Khoảng giá, Tìm kiếm nhanh, Reset filter.
  - [x] Tabs chuyển chế độ: **Sơ đồ phân lô (Grid Matrix)** và **Bảng chi tiết (Table View)**.
  - [x] Thanh thao tác hàng loạt (Batch Operations Bar): Khóa hàng loạt / Mở bán đồng loạt khi chọn checkbox.
  - [x] Chức năng Xuất Bảng Hàng Excel/CSV chuẩn UTF-8.
  - [x] Modal Thêm Căn Hộ Mới vào rổ hàng với lưu trữ Zustand Store.
  - [x] Dialog chi tiết căn: Mặt bằng 2D mini, ưu đãi mở bán, tính toán gói vay 70%, copy thông tin Zalo.
  - [x] Modal Xác nhận giữ chỗ (Booking Flow) có chọn trực tiếp Khách hàng từ danh bạ.

---

### 2. Quản Lý Dự Án & Chi Tiết Dự Án (`/projects`, `/projects/[id]`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác.
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/projects.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/projects.md)
- [x] **Trang danh mục `/projects`**:
  - [x] 5 Thẻ KPI: Doanh thu kỳ vọng (78.0 Nghìn Tỷ VNĐ), Quy mô dự án, Đang mở bán, Sắp mở bán, Đã bàn giao.
  - [x] Bộ lọc đa tầng: Tìm kiếm tên/địa điểm, lọc tình trạng, lọc chủ đầu tư, lọc phân loại BĐS.
  - [x] Chuyển đổi linh hoạt: **Lưới thẻ dự án (Grid Cards)** và **Bảng danh sách chi tiết (Table View)**.
  - [x] Nút Xuất Báo Cáo Danh Mục Dự Án ra file CSV chuẩn UTF-8.
  - [x] Modal Khởi Tạo Đại Dự Án Mới với hàm `addProject` lưu vào Zustand Store.
- [x] **Trang chi tiết `/projects/[id]`**:
  - [x] Header Hero Profile khổng lồ: Ảnh đại diện, Badge CĐT/Tình trạng, Doanh thu mục tiêu, nút Chia sẻ link & Tải trọn bộ Sales Kit.
  - [x] Tab 1: **Tổng Quan (Overview)**: AI Project Summary, Điểm nhấn USPs, Chỉ số bán hàng và **Hệ sinh thái đại tiện ích 5 sao** (Bến du thuyền, Hồ bơi vô cực, Công viên 36ha...).
  - [x] Tab 2: **Bảng Hàng Dự Án (Project Inventory)**: Truy vấn trực tiếp các căn hộ của riêng dự án này từ kho rổ hàng, hiển thị giá bán và nút Giữ chỗ nhanh.
  - [x] Tab 3: **Sa Bàn & Media**: Thư viện 150 ảnh HD, video TVC 4K, Flycam 360°, kết nối trực tiếp Tour căn hộ VR 360 (`/panorama`).
  - [x] Tab 4: **Mặt Bằng 2D/3D (Layout)**: Masterplan, Siteplan, Sơ đồ tầng và component `InteractiveFloorPlan`.
  - [x] Tab 5: **Tài Liệu Sales Kit**: Brochure, Chính sách bán hàng, Pháp lý 1/500, Q&A, Hợp đồng mẫu kèm cơ chế tải về có Toast phản hồi.
  - [x] Tab 6: **AI Đánh Giá Khả Thi Đầu Tư (AI Investment)**: Xếp hạng BUY/STRONG BUY, độ tin cậy, thời gian hoàn vốn, tỷ suất tăng giá kỳ vọng, định giá cạnh tranh và quản trị rủi ro.

---

### 3. Hồ Sơ Khách Hàng 360 (`/customers`, `/customers/[id]`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác.
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/customers.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/customers.md)
- **Mục tiêu**: Quản trị chân dung nhà đầu tư BĐS, lịch sử giao dịch, tài chính và phân bổ chăm sóc.
- **Mock Data**: 8 khách hàng chân thực (`c1` – `c8`), đầy đủ phân hạng (VVIP Kim Cương, VIP Bạch Kim, Tiềm Năng, Mới).
- **Thành phần UI/UX**:
  - [x] Trang danh sách `/customers`:
    - 5 Thẻ KPI: Doanh thu tích lũy, Tổng số khách, Khách VVIP/VIP, Đã giao dịch, Đang chăm sóc.
    - Thanh Tab phân hạng nhanh: Tất cả, VVIP, VIP, Tiềm Năng, Mới (có Badge đếm số lượng).
    - Bộ lọc đa năng 3 chiều: Tìm kiếm thông minh (Tên, SĐT, Email, Mã KH), Lọc trạng thái, Lọc chuyên viên phụ trách.
    - Nút Gọi Điện Nhanh (kết nối tổng đài ảo VoIP và lưu lịch sử cuộc gọi).
    - Nút Xuất Báo Cáo Danh Sách Khách Hàng ra file CSV UTF-8.
    - Modal Thêm Khách Hàng Mới (`addCustomer`) lưu trực tiếp vào Zustand Store.
  - [x] Trang chi tiết `/customers/[id]`:
    - Header Profile: Avatar, Badge phân hạng, Doanh thu đóng góp, Chuyên viên phụ trách, QR Code giới thiệu.
    - 4 Nút tương tác nhanh: Gọi điện VoIP, Gửi email, Chỉnh sửa hồ sơ (`updateCustomer`), Sao chép liên hệ.
    - Tab 1: **Tổng Quan**: Phân tích AI CRM (độ tin cậy 92%), Health Score, Thống kê tài chính.
    - Tab 2: **Tài Chính & Đầu Tư**: Phân bổ tài sản (60% BĐS, 25% Tiết kiệm), Đánh giá tín dụng CIC Hạng A, **Danh sách Hợp đồng & BĐS sở hữu** liên kết từ `contracts` và `inventory`.
    - Tab 3: **Sở Thích & Nhu Cầu**: Khẩu vị sản phẩm, mục đích đầu tư, khoảng ngân sách quan tâm.
    - Tab 4: **Định Danh CCCD**: Ảnh thẻ CCCD gắn chip mặt trước & mặt sau, số định danh, nơi thường trú.
    - Tab 5: **Hành Trình Khách Hàng**: Phễu chuyển đổi từ Lead ➔ Quan tâm ➔ Xem sa bàn ➔ Cọc giữ chỗ ➔ Ký HĐMB.
    - Tab 6: **Dòng Sự Kiện Tương Tác (Timeline)**: Lịch sử cuộc gọi, email, buổi xem nhà mẫu, ký cọc.

---

### 4. Quy Trình Giữ Chỗ & Đặt Cọc (`/booking`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Zustand Store).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/booking.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/booking.md)
- **Mục tiêu**: Số hóa toàn trình quy trình lock căn, phê duyệt đa cấp (Sale ➔ Quản lý ➔ Giám đốc ➔ Kế toán), đối soát tiền cọc vào tài khoản CĐT và đếm ngược thời gian SLA khóa căn tự động.
- **Mock Data**: 8 phiếu booking chân thực (`BK-1001` – `BK-1008`) kết nối trực tiếp với danh bạ Khách hàng, Dự án và Rổ hàng.
- **Thành phần UI/UX**:
  - [x] 5 Thẻ KPI tài chính & tiến độ: Tổng hồ sơ booking, Chờ cấp duyệt, Chờ kế toán xác nhận tiền, Đã khóa căn, Tổng giá trị tiền cọc (VNĐ).
  - [x] Thanh lọc đa chiều 5 tiêu chí: Lọc theo Dự án, Nhân viên Sale, Loại Booking (Có hoàn lại / Không hoàn lại / Ký HĐ Cọc), Mức ưu tiên / SLA, và Ô tìm kiếm tức thì.
  - [x] Bảng Kanban 5 cột chuẩn mực: 1. Khởi Tạo (Sale) ➔ 2. Quản Lý Duyệt ➔ 3. GĐ Khối Duyệt ➔ 4. Chờ Kế Toán ➔ 5. Đã Khóa Căn.
  - [x] Thẻ Kanban Card tương tác: Huy hiệu phân loại, cảnh báo quá hạn SLA (viền đỏ nhấp nháy), nút xem Chi tiết, nút Từ chối trả về Sale kèm lý do, nút Duyệt chuyển bước tức thì.
  - [x] Modal "+ Tạo Yêu Cầu Booking Mới" (`addBookingTicket`): Tự động liên kết danh bạ khách hàng, lọc mã căn khả dụng theo dự án đã chọn, nhập số tiền cọc (100Tr/200Tr) và tự động đổi trạng thái căn sang `Booking` trong rổ hàng.
  - [x] Modal "Chi Tiết Phiếu Booking & Phê Duyệt Hồ Sơ": Stepper tiến trình 5 bước, thông tin khách hàng, thông tin căn hộ, mô phỏng Phiếu Ủy Nhiệm Chi (UNC) chuẩn ngân hàng có dấu mộc điện tử, đồng hồ đếm ngược SLA và nút gia hạn thêm 30 phút.
  - [x] Nút "Xuất CSV" chuẩn UTF-8 BOM tải về danh sách toàn bộ phiếu booking cho kế toán đối soát.
  - [x] Hệ thống Toast Banner nổi phản hồi mượt mà cho mọi hành động (Tạo mới, Duyệt bước, Từ chối, Gia hạn SLA).

---

### 5. Quản Lý Hợp Đồng & Thanh Toán (`/contracts`, `/contracts/[id]`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Zustand Store).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/contracts.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/contracts.md)
- **Mục tiêu**: Quản lý toàn bộ vòng đời pháp lý, dòng tiền thực thu và tiến độ giải ngân theo từng giai đoạn thi công xây dựng thực tế.
- **Mock Data**: 8 hợp đồng pháp lý hoàn chỉnh (`ct1` – `ct8`) với đầy đủ phụ lục tiến độ thanh toán (5 – 6 đợt), gói vay tín dụng ngân hàng và hồ sơ tài liệu đính kèm.
- **Thành phần UI/UX**:
  - [x] **Trang danh mục `/contracts`**:
    - 5 Thẻ KPI: Doanh số ký kết, Thực thu vào tài khoản, Công nợ thu theo tiến độ, Tình trạng pháp lý (Đã ký / Chờ duyệt), Dư nợ ngân hàng bảo lãnh.
    - Bộ lọc đa chiều 6 tiêu chí: Lọc Dự án, Loại HĐ, Trạng thái, Ngân hàng bảo lãnh, Tiến độ thu (%), Ô tìm kiếm thông minh.
    - Bảng hợp đồng chi tiết: Mã HĐ, Bên mua (Khách hàng VVIP/VIP), Bất động sản, Loại HĐ & Ngân hàng, Giá trị & Thanh tiến độ %, Nút xem chi tiết.
    - Nút "Xuất Báo Cáo (CSV)" chuẩn UTF-8 BOM.
    - Modal "+ Lập Hợp Đồng Mới" (`addContract`): Kết nối rổ hàng, danh bạ khách hàng, tự động sinh phụ lục thanh toán mẫu.
  - [x] **Trang chi tiết `/contracts/[id]`**:
    - Thanh tác vụ: Nút Phê duyệt & Ký HĐ, In bản cứng (`window.print()`), Gửi email thông báo khách, Tải scan PDF có mộc đỏ.
    - Khối thông tin Bên Mua (Bên B) và Bất động sản chuyển nhượng.
    - Bảng phụ lục kế hoạch thanh toán chi tiết: Hiển thị mốc tiến độ thi công, tỷ lệ %, số tiền, hạn nộp, trạng thái và **Nút "Thu tiền đợt"** cập nhật dòng tiền thời gian thực (`recordContractPayment`).
    - Khung xem trước bản mềm hợp đồng (Mock Document Viewer) với Quốc hiệu, Tiêu ngữ, Điều khoản và chữ ký số CĐT.
    - Thông tin gói vay tín dụng & ngân hàng bảo lãnh (Hỗ trợ lãi suất 0% và ân hạn nợ gốc 18 - 24 tháng).
    - Thư viện tài liệu đính kèm (Scan HĐMB, CCCD, UNC, Biên bản nghiệm thu) và Modal tải lên tài liệu mới.

---

## GIAI ĐOẠN 2: BÀN LÀM VIỆC THEO VAI TRÒ & VẬN HÀNH ĐỘI NGŨ

### 6. Bàn Làm Việc Chiến Binh Sale (`/agent`)
- [ ] **Mục tiêu**: Workspace trung tâm cho Sale tác nghiệp mỗi ngày.
- **Mock Data**: KPI cá nhân tháng, chỉ tiêu doanh số 15 tỷ, hoa hồng ước tính, tỷ lệ chốt deal.
- **Thành phần UI/UX**:
  - [ ] Widget KPI cá nhân: Doanh số thực đạt vs Chỉ tiêu, Hoa hồng tích lũy, Deal đang theo đuổi.
  - [ ] Widget "Việc Cần Làm Hôm Nay": 4 khách hàng cần gọi lại, 2 lịch hẹn xem sa bàn Aqua City.
  - [ ] Bảng "Giỏ hàng nóng vừa mở": 3 căn biệt thự view sông vừa được bung ra thị trường.
  - [ ] Nút thao tác nhanh: Tạo mới khách hàng, Gửi bảng giá Zalo, Tạo phiếu booking nhanh.

---

### 7. Bàn Quản Lý Trưởng Phòng / Giám Đốc Sàn (`/manager`)
- [ ] **Mục tiêu**: Giám sát hiệu suất nhóm kinh doanh, phân bổ giỏ hàng và duyệt chính sách.
- **Mock Data**: Bảng xếp hạng doanh số 5 nhóm kinh doanh, tỷ lệ chuyển đổi, danh sách phê duyệt tồn đọng.
- **Thành phần UI/UX**:
  - [ ] Thống kê tổng hợp sàn: Tổng doanh thu tuần/tháng, số căn chốt cọc, hoa hồng nhóm.
  - [ ] Bảng xếp hạng thi đua (Leaderboard): Xếp hạng Top 5 chiến binh chốt deal xuất sắc nhất.
  - [ ] Hộp duyệt nhanh (Pending Approvals): Duyệt đề xuất chiết khấu thêm 1% cho khách VIP, duyệt giữ căn ưu tiên.
  - [ ] Phân bổ Lead nóng cho các nhóm theo cơ chế xoay vòng.

---

### 8. Bàn Lãnh Đạo C-Level / BOD (`/director`)
- [ ] **Mục tiêu**: Báo cáo tổng thể bức tranh tài chính, tiến độ bán hàng của toàn bộ các dự án cho Ban Tổng Giám Đốc.
- **Mock Data**: Tỷ lệ hấp thụ giỏ hàng theo từng dự án, doanh thu kế hoạch vs thực thu, dự báo dòng tiền 6 tháng tới.
- **Thành phần UI/UX**:
  - [ ] Thẻ tài chính cấp cao: Tổng giá trị phát triển (GDV), Doanh thu lũy kế, Dòng tiền dự kiến thu quý tới.
  - [ ] Biểu đồ cơ cấu doanh thu theo dự án (Donut / Bar Chart).
  - [ ] Tỷ lệ hấp thụ giỏ hàng từng dự án (ví dụ: Aqua City đã bán 82%, Grand Manhattan đã bán 91%).
  - [ ] Bộ lọc thời gian: Tháng này, Quý này, Năm nay.

---

### 9. Quản Lý Công Việc & Lịch Hẹn (`/tasks`)
- [ ] **Mục tiêu**: Lên lịch hẹn dẫn khách xem dự án, chuẩn bị hồ sơ vay ngân hàng, ký hợp đồng.
- **Mock Data**: 12 công việc phân loại theo mức độ ưu tiên (Khẩn cấp, Cao, Bình thường) và trạng thái (Todo, In Progress, Done).
- **Thành phần UI/UX**:
  - [ ] Chế độ xem: Kanban công việc hoặc Lịch làm việc tuần/tháng.
  - [ ] Bộ lọc: Theo nhân viên, mức độ ưu tiên, ngày hết hạn.
  - [ ] Modal tạo công việc: Tiêu đề, liên kết khách hàng, ngày hết hạn, nhắc nhở trước 15 phút.

---

### 10. Quy Trình Phê Duyệt Đa Cấp (`/workflow`)
- [ ] **Mục tiêu**: Chuẩn hóa quy trình xin phê duyệt chiết khấu, đổi căn, hủy cọc hoặc ký ngoại lệ.
- **Mock Data**: Sơ đồ 3 cấp duyệt: *Cấp 1 (Trưởng nhóm) ➔ Cấp 2 (Giám đốc sàn) ➔ Cấp 3 (Kế toán trưởng / TGĐ)*.
- **Thành phần UI/UX**:
  - [ ] Trình xem biểu đồ quy trình trực quan (Visual Workflow Diagram).
  - [ ] Bảng danh sách phiếu trình duyệt: Mã phiếu, người gửi, loại yêu cầu, người đang giữ quyền duyệt.
  - [ ] Modal phê duyệt: Nhập ý kiến nhận xét, đính kèm biên bản, nút Phê duyệt / Trả về / Từ chối.

---

## GIAI ĐOẠN 3: CÔNG NGHỆ BẤT ĐỘNG SẢN TIÊN PHONG (PROPTECH & AI)

### 11. Bản Đồ Số Quy Hoạch BĐS (`/gis`)
- [ ] **Mục tiêu**: Xem vị trí dự án trên nền bản đồ địa lý thực tế cùng các lớp quy hoạch hạ tầng giao thông.
- **Mock Data**: Tọa độ GPS thật của NovaWorld Phan Thiet, Aqua City, The Global City, Vinhomes Grand Park.
- **Thành phần UI/UX**:
  - [ ] Bản đồ tương tác Leaflet: Ghim vị trí các dự án với Icon phân biệt loại hình.
  - [ ] Lớp phủ hạ tầng (Overlays): Cao tốc Dầu Giây - Phan Thiết, Sân bay Long Thành, Vành Đai 3.
  - [ ] Popup dự án: Khi bấm vào ghim, hiển thị ảnh đại diện, giá trung bình/m², số căn còn lại và nút *"Xem giỏ hàng"*.

---

### 12. Virtual Tour 360 & Sa Bàn Số (`/panorama`)
- [ ] **Mục tiêu**: Trải nghiệm xem căn hộ mẫu 360 độ và sa bàn ảo trực tiếp trên trình duyệt.
- **Mock Data**: Danh mục góc chụp 360 của Biệt thự biển NovaWorld và Căn hộ hạng sang Grand Manhattan.
- **Thành phần UI/UX**:
  - [ ] Màn hình thực tế ảo 360 tương tác chuột xoay các hướng (Three.js / WebGL Viewer).
  - [ ] Điểm chuyển cảnh (Hotspots): Bấm để chuyển từ Phòng khách ➔ Ban công view biển ➔ Phòng ngủ Master.
  - [ ] Thước đo ảo: Bật/tắt kích thước chiều rộng phòng khách, chiều cao trần nhà.

---

### 13. Trợ Lý AI Chuyên Sâu BĐS (`/ai-knowledge`)
- [ ] **Mục tiêu**: Trợ lý AI giải đáp tức thì chính sách bán hàng, pháp lý dự án và so sánh giá cho môi giới.
- **Mock Data**: Bộ tri thức tài liệu dự án đã nhúng (Chính sách chiết khấu, tiến độ thanh toán, ngân hàng cho vay).
- **Thành phần UI/UX**:
  - [ ] Khung chat AI Copilot với các nút câu hỏi gợi ý nhanh:
    - *"So sánh chính sách thanh toán Aqua City và The Global City"*
    - *"Tính dòng tiền vay ngân hàng cho căn Shophouse 12 tỷ"*
    - *"Căn hộ Grand Manhattan có được cấp sổ hồng sở hữu lâu dài không?"*
  - [ ] Câu trả lời hỗ trợ định dạng bảng, gạch đầu dòng rõ ràng và trích dẫn số trang tài liệu nguồn.

---

### 14. Document AI & OCR Giấy Tờ (`/document-ai`)
- [ ] **Mục tiêu**: Tự động bóc tách thông tin từ ảnh chụp CCCD, Hộ chiếu, Sổ hồng để điền form hợp đồng tự động.
- **Mock Data**: Mẫu kết quả quét CCCD gắn chip và Giấy xác nhận tình trạng độc thân.
- **Thành phần UI/UX**:
  - [ ] Khu vực kéo thả tải file ảnh/PDF.
  - [ ] Hiệu ứng quét văn bản (Scanning Animation) và chỉ số độ chính xác (99.4%).
  - [ ] Form hiển thị dữ liệu đã trích xuất: Họ tên, Số CCCD, Ngày cấp, Nơi thường trú kèm nút *"Đẩy vào hồ sơ khách hàng"*.

---

### 15. Dữ Liệu Thị Trường & Định Giá (`/market-data`)
- [ ] **Mục tiêu**: Cung cấp bức tranh dữ liệu giá đất, chỉ số sinh lời và so sánh biến động giá các khu vực.
- **Mock Data**: Dữ liệu giá bán trung bình/m² của TP. Thủ Đức, Đồng Nai, Phan Thiết từ 2021 đến 2026.
- **Thành phần UI/UX**:
  - [ ] Biểu đồ đường biến động giá đất theo thời gian (Line Chart Recharts).
  - [ ] Công cụ định giá nhanh: Chọn khu vực, loại hình (nhà phố/biệt thự/căn hộ), diện tích ➔ Ước tính giá thị trường.

---

## GIAI ĐOẠN 4: TIẾP THỊ, KHÁCH HÀNG & MẠNG LƯỚI ĐỐI TÁC

### 16. Chiến Dịch Marketing & Phân Bổ Lead (`/marketing`)
- [ ] **Mục tiêu**: Quản lý các chiến dịch quảng cáo Facebook, Google Ads, TikTok và phân bổ data khách hàng cho sale.
- **Mock Data**: 4 chiến dịch quảng cáo kèm số liệu CPL (Cost per Lead), số lead thu về, ngân sách đã tiêu.
- **Thành phần UI/UX**:
  - [ ] Thẻ KPI: Tổng chi tiêu, Tổng Leads, Giá trung bình mỗi Lead, Tỷ lệ chuyển đổi sang Booking.
  - [ ] Cấu hình chia Lead tự động: Theo cơ chế xoay vòng (Round-robin) hoặc Ưu tiên Top Seller.

---

### 17. CMS Tin Tức, Sự Kiện & Banner (`/cms`)
- [x] **Trạng thái**: Đã có bộ lọc bài viết và switch banner tương tác.
- **Mục tiêu**: Quản trị bài viết tin tức thị trường, cẩm nang đầu tư BĐS và hệ thống banner quảng cáo trang chủ.
- **Thành phần UI/UX**:
  - [x] Bộ lọc tìm kiếm bài viết theo từ khóa và chuyên mục.
  - [x] Danh sách Banner với nút gạt bật/tắt (Toggle Status) lưu trạng thái trực tiếp.
  - [ ] Modal xem trước nội dung bài viết và chỉnh sửa nhanh tiêu đề/ảnh đại diện.

---

### 18. Sự Kiện Mở Bán & Check-in QR (`/events`)
- [ ] **Mục tiêu**: Quản lý sự kiện mở bán tập trung tại khách sạn/trung tâm hội nghị, quét mã QR check-in khách VIP.
- **Mock Data**: Sự kiện *"Lễ mở bán Phân khu River Park - Aqua City"* với 500 khách mời.
- **Thành phần UI/UX**:
  - [ ] Danh sách khách mời, bàn tiệc, số ghế ngồi.
  - [ ] Giao diện máy quét mã QR Check-in: Quét camera hoặc nhập mã vé ➔ Hiển thị tên khách và bàn tiệc tương ứng.

---

### 19. Chương Trình Hội Viên & Loyalty (`/loyalty`)
- [ ] **Mục tiêu**: Chăm sóc khách hàng thân thiết, nâng hạng hội viên (Gold, Platinum, Diamond) và đổi quà tri ân.
- **Mock Data**: Bảng tích điểm theo giá trị giao dịch BĐS (100 triệu = 100 điểm NovaLoyalty).
- **Thành phần UI/UX**:
  - [ ] Thẻ hội viên số hóa với màu sắc sang trọng theo từng hạng bậc.
  - [ ] Danh mục voucher quà tặng: Nghỉ dưỡng resort 5 sao Phan Thiết, Voucher du thuyền, Ưu đãi phí quản lý.

---

### 20. Affiliate & Mạng Lưới Cộng Tác Viên (`/referral`)
- [x] **Trạng thái**: Đã tích hợp biểu đồ diện tích Recharts và tương tác sao chép link/rút tiền.
- **Mục tiêu**: Kích hoạt mạng lưới cộng tác viên giới thiệu khách mua nhà hưởng hoa hồng.
- **Thành phần UI/UX**:
  - [x] Biểu đồ hiệu suất 2 trục: Số lượt click link vs Số deal chốt thành công qua các tuần.
  - [x] Sao chép link giới thiệu cá nhân, tải ảnh mã QR, chia sẻ Zalo/Facebook.
  - [x] Thẻ số dư ví hoa hồng, lịch sử rút tiền về tài khoản ngân hàng.

---

### 21. Sàn Giao Dịch Bán Chéo F2 (`/marketplace`)
- [ ] **Mục tiêu**: Sàn kết nối giữa các đơn vị phân phối BĐS F1 và đại lý liên kết F2 để chia sẻ rổ hàng bán chéo.
- **Mock Data**: Danh sách 6 rổ hàng mở bán chéo với tỷ lệ chia sẻ hoa hồng (từ 2.5% đến 4%).
- **Thành phần UI/UX**:
  - [ ] Thẻ rổ hàng liên kết: Tên dự án, đại lý chủ quản, số căn mở bán, mức hoa hồng cam kết.
  - [ ] Nút bấm nhận quyền phân phối (Request Distribute) có modal xác nhận điều khoản.

---

### 22. Khảo Sát Khách Hàng & Chỉ Số NPS (`/surveys`)
- [ ] **Mục tiêu**: Đánh giá độ hài lòng của khách sau các chuyến đi xem dự án thực tế hoặc sau khi nhận nhà.
- **Mock Data**: Bảng câu hỏi đánh giá 5 sao về thái độ phục vụ của nhân viên, độ tiện nghi của xe đưa đón.
- **Thành phần UI/UX**:
  - [ ] Biểu đồ đo điểm Net Promoter Score (NPS) từ -100 đến +100.
  - [ ] Bảng tổng hợp nhận xét của khách hàng và cảnh báo các phản hồi tiêu cực cần xử lý ngay.

---

## GIAI ĐOẠN 5: TÀI CHÍNH, VẬN HÀNH & NỀN TẢNG HỆ THỐNG

### 23. Báo Cáo Phân Tích Thông Minh BI (`/bi`)
- [ ] **Mục tiêu**: Dashboard phân tích kinh doanh đa chiều: Phễu bán hàng, dòng tiền thực tế và dự báo tồn kho.
- **Mock Data**: Phễu chuyển đổi: *1,200 Leads ➔ 340 Đi xem dự án ➔ 85 Giữ chỗ ➔ 42 Ký HĐMB*.
- **Thành phần UI/UX**:
  - [ ] Biểu đồ Funnel phễu chuyển đổi.
  - [ ] Biểu đồ cơ cấu doanh thu theo tuần, tháng và phương thức thanh toán.

---

### 24. Tổng Đài Ảo VoIP Cloud (`/call-center`)
- [ ] **Mục tiêu**: Gọi điện trực tiếp cho khách hàng từ trình duyệt, nghe lại file ghi âm và chấm điểm cuộc gọi.
- **Mock Data**: Lịch sử 8 cuộc gọi tư vấn gần nhất với thời lượng, kết quả (Khách bận/Khách quan tâm/Hẹn xem nhà).
- **Thành phần UI/UX**:
  - [ ] Bàn phím quay số ảo (Dialpad) với âm thanh bấm số.
  - [ ] Trình phát file ghi âm cuộc gọi mini (Play/Pause, thanh thời gian).

---

### 25. Kênh Trò Chuyện Nội Bộ & Khách Hàng (`/chat`)
- [ ] **Mục tiêu**: Kênh liên lạc tức thì giữa các thành viên trong sàn giao dịch và nhận tin nhắn từ Zalo OA.
- **Mock Data**: 3 phòng chat: *Nhóm Dự Án Aqua City*, *Khách VIP Nguyễn Văn A*, *Nhóm Hỗ Trợ Pháp Lý*.
- **Thành phần UI/UX**:
  - [ ] Khung chat real-time với bong bóng tin nhắn, hiển thị trạng thái đã đọc và đính kèm ảnh căn hộ.

---

### 26. Đua Top Doanh Số & Gamification (`/gamification`)
- [ ] **Mục tiêu**: Thúc đẩy tinh thần chiến binh sales thông qua bảng vàng vinh danh và huy hiệu danh giá.
- **Mock Data**: Xếp hạng Top Gun tháng, danh hiệu *Chiến thần chốt cọc*, *Vua căn hộ hạng sang*.
- **Thành phần UI/UX**:
  - [ ] Bục vinh danh 3 vị trí dẫn đầu (Hạng 1 Cúp Vàng, Hạng 2 Bạc, Hạng 3 Đồng) kèm hiệu ứng đẹp mắt.
  - [ ] Thanh tiến độ đạt mốc thưởng (Ví dụ: Chốt thêm 1 căn để nhận chuyến du lịch Châu Âu).

---

### 27. Bảng Tính Lãi Vay Ngân Hàng (`/mortgage`)
- [ ] **Mục tiêu**: Công cụ tính nhanh lịch trả góp gốc lãi hàng tháng cho khách mua nhà vay vốn.
- **Mock Data**: Lãi suất ưu đãi 6.5%/năm đầu tiên, lãi suất thả nổi 9.5%/năm các năm sau.
- **Thành phần UI/UX**:
  - [ ] Thanh trượt (Slider) linh hoạt: Giá trị căn nhà, Số tiền vay (tối đa 70%), Thời hạn vay (10-35 năm).
  - [ ] Bảng khấu hao gốc và lãi chi tiết từng tháng kèm nút xuất PDF gửi khách hàng.

---

### 28. Quản Lý Danh Mục Đầu Tư KH (`/portfolio`)
- [ ] **Mục tiêu**: Sổ tay tài sản dành riêng cho khách hàng VIP theo dõi danh mục bất động sản sở hữu.
- **Mock Data**: 1 khách hàng sở hữu 3 BĐS với tổng giá trị mua 32 tỷ, giá trị thị trường ước tính hiện tại 38.5 tỷ (+20.3%).
- **Thành phần UI/UX**:
  - [ ] Thẻ tổng quan tài sản: Tổng vốn đầu tư, Lợi nhuận tạm tính (ROI), Lịch đóng tiền đợt tiếp theo.
  - [ ] Danh thiếp số hóa cho từng căn nhà kèm tiến độ hoàn thiện công trình.

---

### 29. Kho Tài Liệu Pháp Lý & Biểu Mẫu (`/documents`)
- [ ] **Mục tiêu**: Thư viện lưu trữ bản scan phê duyệt quy hoạch 1/500, giấy phép xây dựng, mẫu HĐMB.
- **Mock Data**: 15 tệp tài liệu phân chia theo thư mục từng dự án.
- **Thành phần UI/UX**:
  - [ ] Cây thư mục (Folder Tree) theo Dự án.
  - [ ] Danh sách file có dung lượng, định dạng (PDF, DWG, DOCX) và nút Tải xuống nhanh.

---

### 30. Trạm Di Động PWA Đi Thị Trường (`/mobile`)
- [x] **Trạng thái**: Đã chuẩn hóa TypeScript và cơ chế Sync Queue.
- **Mục tiêu**: Ứng dụng di động dành cho Sale đi dẫn khách tại công trường có khả năng hoạt động khi mất sóng.
- **Thành phần UI/UX**:
  - [x] Khung giả lập iPhone thực tế với Notch và tai thỏ.
  - [x] Công tắc giả lập mất mạng (Offline-first) và hàng đợi đồng bộ tác vụ (Sync Queue).
  - [x] Vùng ký tên cảm ứng điện tử (E-Signature) trên màn hình cảm ứng.
  - [x] Bắn thông báo đẩy (Push Notification) hiển thị Toast iOS sinh động.

---

### 31. Tích Hợp API, Webhook & ERP (`/integrations`)
- [ ] **Mục tiêu**: Cổng kết nối CRM với phần mềm kế toán MISA, Fast, Zalo ZNS và cổng VietQR.
- **Mock Data**: 6 cổng tích hợp với trạng thái kết nối (Connected, Disconnected) và thời gian đồng bộ gần nhất.
- **Thành phần UI/UX**:
  - [ ] Thẻ đối tác tích hợp (Zalo Cloud, MISA SME, SMS Brandname, VNPT eKYC).
  - [ ] Form cấu hình API Key, Webhook URL và nút "Kiểm tra kết nối" (Test Connection).

---

### 32. Cài Đặt Hệ Thống & Phân Quyền RBAC (`/settings`)
- [x] **Trạng thái**: Đã hoàn thiện ma trận phân quyền tương tác và lưu cấu hình.
- **Mục tiêu**: Phân quyền chi tiết 4 cấp bậc tài khoản, cấu hình tên miền thương hiệu riêng (White-label) và xem Audit Log.
- **Thành phần UI/UX**:
  - [x] Ma trận phân quyền RBAC 10 quyền hạn cốt lõi: Xem khách, sửa hợp đồng, xuất Excel, xóa dữ liệu...
  - [x] Checkbox có thể bật/tắt trực tiếp cho từng quyền của từng chức danh.
  - [x] Cấu hình White-label: Logo công ty, màu chủ đạo, tên miền riêng cho từng sàn con.
  - [x] Bảng nhật ký Audit Log ghi nhận IP, thời gian và hành vi của người dùng trên hệ thống.

---

## 🎯 5 NGUYÊN TẮC NGHIỆM THU MỖI TRANG (DEFINITION OF DONE)

Khi bạn hoàn thành bất kỳ trang nào trong danh sách trên, hãy tự kiểm tra 5 tiêu chí:
1. **Dữ liệu Mock chân thực**: Sử dụng số tiền VNĐ, địa danh, tên dự án và khách hàng thực tế tại Việt Nam.
2. **Không nút chết (No Dead Elements)**: Mọi nút bấm đều phải kích hoạt Modal, thay đổi State hoặc hiển thị thông báo Toast.
3. **Tìm kiếm & Bộ lọc tức thì**: Thay đổi ô tìm kiếm hoặc dropdown bộ lọc phải cập nhật ngay danh sách dữ liệu hiển thị.
4. **Giao diện Responsive**: Bố cục co giãn hài hòa trên màn hình Desktop, Tablet và Mobile.
5. **Zero Error Compilation**: Chạy `npm run build` thành công, không có bất kỳ lỗi cú pháp hoặc TypeScript nào.
