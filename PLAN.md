# KẾ HOẠCH TOÀN DIỆN TRIỂN KHAI MOCK UI CHO TỪNG TRANG (NOVA CRM)

> Tài liệu này được thiết kế để theo dõi tiến độ từng trang theo dạng Checklist. Mỗi trang đều có đầy đủ mục tiêu, mô hình dữ liệu Mock, thành phần UI/UX và tiêu chuẩn nghiệm thu độc lập.

---

## 📊 TỔNG QUAN TIẾN ĐỘ THEO GIAI ĐOẠN

- [x] **Giai đoạn 1**: Chu Trình Bất Động Sản Cốt Lõi (5/5 phân hệ hoàn tất khung & dữ liệu)
- [x] **Giai đoạn 2**: Bàn Làm Việc Theo Vai Trò & Vận Hành Đội Ngũ (5/5 phân hệ hoàn tất chuyên sâu)
- [x] **Giai đoạn 3**: Công Nghệ Số & PropTech Tiên Phong (5/5 phân hệ hoàn tất chuyên sâu)
- [x] **Giai đoạn 4**: Tiếp Thị, Khách Hàng & Mạng Lưới Đối Tác (8/8 trang hoàn tất 100% chuyên sâu bao gồm Đấu giá BĐS /auction [x])
- [x] **Giai đoạn 5**: Tài Chính, Vận Hành & Nền Tảng Hệ Thống (5/5 phân hệ hoàn tất 100% chuyên sâu)
- [x] **Giai đoạn 6**: Quản Trị Gia Sản, Vận Hành Bàn Giao & Thị Trường Thứ Cấp (8/8 phân hệ hoàn tất 100% chuyên sâu: Portfolio /portfolio [x], Tài liệu /documents [x], PWA Mobile /mobile [x], Tích hợp API /integrations [x], Cài đặt RBAC /settings [x], Bàn giao & Nghiệm thu /handover [x], Vận Hành & Dịch Vụ Cư Dân /operations [x], Ký Gửi & Thị Trường Thứ Cấp /resale [x])

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
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Zustand Store).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/agent.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/agent.md)
- **Mục tiêu**: Workspace trung tâm (Sales Cockpit) cho Sale tác nghiệp mỗi ngày, theo dõi doanh số cá nhân, quản trị khách hàng nóng và nắm bắt giỏ hàng vừa mở bán.
- **Mock Data**: KPI cá nhân tháng, chỉ tiêu doanh số 15 tỷ (thực đạt 37.5 tỷ), hoa hồng ước tính 3% net (1.12 tỷ), 4 khách hàng nóng và 3 căn giỏ hàng flash deal.
- **Thành phần UI/UX**:
  - [x] Header định danh với Agent Switcher (chuyển đổi xem tác nghiệp của Lê Hoàng Anh, Tuấn Tú, Thanh Hà, Minh Anh).
  - [x] 5 Thẻ KPI cá nhân: Doanh số thực đạt vs Chỉ tiêu, Hoa hồng tích lũy 3%, Booking đang giữ chỗ SLA, Khách hàng phụ trách, Tỷ lệ chốt deal (26.8%).
  - [x] Bộ lọc chu kỳ tác nghiệp 3 mốc: Hôm nay (Daily Focus), Tuần này (Pipeline), Tháng này (KPI Quota).
  - [x] Biểu đồ BarChart Recharts: So sánh chỉ tiêu KPI vs Doanh số thực thu theo từng ngày trong tuần.
  - [x] Widget "Hot Leads Radar": Danh sách khách hàng nóng xếp hạng theo Điểm Nhiệt AI (85 - 98/100) tích hợp nút Gọi VoIP, Nhắn Zalo và Xem hồ sơ 360°.
  - [x] Widget "Giỏ Hàng Nóng Vừa Mở Bán (Flash Deal)": Hiển thị các căn hoa hậu vừa bung hàng kèm nút Giữ Chỗ (Booking) tức thì.
  - [x] Widget "Nhiệm Vụ Hôm Nay (Smart Checklist)": Danh sách đầu việc với checkbox tương tác trực tiếp (gạch ngang khi xong có toast thông báo) và nút "+ Thêm việc".
  - [x] Widget "Lịch Trình Tác Nghiệp (Timeline)": Lịch trình chi tiết trong ngày (Giao ban, Telesale, Đón khách xem sa bàn, Nộp cọc kế toán).
  - [x] Widget "Trợ Lý AI Gợi Ý Chốt Deal": Gợi ý kịch bản mở đầu và chiết khấu nội thất 300 triệu.
  - [x] 3 Modal tác nghiệp nhanh: Điểm danh GPS Check-in với định vị Novaland Gallery, Gửi báo giá Zalo/SMS nhanh với link VR360, và Thêm khách hàng mới (`addCustomer`).

---

### 7. Bàn Quản Lý Trưởng Phòng / Giám Đốc Sàn (`/manager`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock UI & State Management (Zustand Store).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/manager.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/manager.md)
- **Mục tiêu**: Giám sát hiệu suất nhóm kinh doanh, phân bổ giỏ hàng độc quyền, duyệt chính sách chiết khấu ngoại giao & điều phối rổ lead nóng.
- **Mock Data**: Bảng xếp hạng doanh số 4 nhóm kinh doanh, tỷ lệ chuyển đổi, danh sách phê duyệt tồn đọng liên kết trực tiếp Zustand store.
- **Thành phần UI/UX**:
  - [x] Header điều hành với bộ chuyển đổi 3 Sàn Giao Dịch (Novaland Gallery Q1, Thủ Đức Masterise, Aqua City Đồng Nai) và bộ lọc chu kỳ (Tháng 7/2026, Quý 3, Năm).
  - [x] 5 Thẻ chỉ số chiến lược: Doanh số thực đạt 128.5 Tỷ (85.7% Quota), 18 Deals cọc (tỷ lệ chốt 21.4%), Giỏ hàng đang khóa giữ chỗ SLA, Tổng hoa hồng phân bổ 3.85 Tỷ, và Hồ sơ chờ duyệt.
  - [x] Biểu đồ Recharts BarChart so sánh Doanh số Thực đạt vs Chỉ tiêu Quota của 4 Đội kinh doanh (Diamond Alpha, Platinum Stars, Golden Hunters, Elite VIP Club).
  - [x] Biểu đồ Recharts PieChart Donut cơ cấu doanh thu theo 4 dự án trọng điểm (The Global City, Aqua City, NovaWorld Phan Thiet, Grand Manhattan).
  - [x] Hộp Phê Duyệt Nhanh Cấp Quản Lý (Manager Approval Desk): Bộ lọc tab (Tất cả, Chờ Quản lý, Chờ GĐ Khối, Gấp SLA) với các nút thao tác trực tiếp: Phê duyệt một chạm, Gia hạn +30p SLA, Từ chối kèm lý do và Xem chi tiết hồ sơ.
  - [x] Bảng Xếp Hạng Thi Đua & Tôn Vinh Chiến Binh (Leaderboard): Xếp hạng Top 1 👑, Top 2 🥈, Top 3 🥉 với huy hiệu cao cấp, % hoàn thành KPI, nút Thưởng nóng & Giao Lead, cùng tab Bảng Thi Đua 4 Nhóm.
  - [x] 4 Modal tác nghiệp: Phân Bổ Quota Rổ Hàng Ngoại Giao, Điều Phối Chia Lead Nóng Tự Động (Round-Robin), Quyết Định Khen Thưởng Nóng, Chi Tiết Hồ Sơ Thẩm Định.
  - [x] Nút Xuất Báo Cáo Sàn (.CSV) tải trực tiếp dữ liệu hiệu suất chuẩn UTF-8 BOM.


---

### 8. Bàn Lãnh Đạo C-Level / BOD (`/director`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock UI & State Management (Zustand Store).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/director.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/director.md)
- **Mục tiêu**: Báo cáo tổng thể bức tranh tài chính, tiến độ bán hàng của toàn bộ các dự án, dự báo dòng tiền AI & ban hành nghị quyết HĐQT.
- **Mock Data**: GDV 102,000 Tỷ, doanh thu lũy kế 52,300 Tỷ, dòng tiền thu ròng Q4 +8,450 Tỷ, hấp thụ 74.8%, biên lợi nhuận gộp 28.6% liên kết trực tiếp Zustand store.
- **Thành phần UI/UX**:
  - [x] Header điều hành với bộ chuyển đổi 3 Khối Quản Trị (Toàn Tập Đoàn, Khối Đô Thị Vệ Tinh, Khối BĐS Trung Tâm) và bộ lọc chu kỳ tài chính (Năm 2026 YTD, Quý 3, Kế hoạch 2027).
  - [x] 5 Thẻ chỉ số tài chính vĩ mô: Tổng GDV Danh mục (102,000 Tỷ), Doanh thu đã thu lũy kế (52,300 Tỷ - 51.3% GDV, +24.5% YoY), Dòng tiền thu quý tới (+8,450 Tỷ, Quick Ratio 1.85x), Tỷ lệ hấp thụ giỏ hàng (74.8%), và Biên lợi nhuận gộp (28.6%, EBITDA 14,800 Tỷ).
  - [x] Biểu đồ Recharts ComposedChart dự báo cân đối dòng tiền Thu - Chi & Thặng dư ròng 8 tháng (Inflow, Outflow, Net Line).
  - [x] Biểu đồ Recharts PieChart Donut cơ cấu doanh thu theo 3 phân khúc BĐS (Biệt thự nghỉ dưỡng 42%, Shophouse 31%, Căn hộ hạng sang 27%).
  - [x] Bảng Sức Khỏe Tài Chính & Tỷ Lệ Hấp Thụ 5 Đại Dự Án (The Global City, Aqua City, Grand Manhattan, NovaWorld Phan Thiet, Vinhomes Grand Park) với số liệu căn, doanh thu, IRR và nút thẩm định AI.
  - [x] Sổ Nghị Quyết & Quyết Định Cấp Chiến Lược Của HĐQT: Danh mục nghị quyết đã ban hành kèm nút "Xác Thực Ký Số" (OTP 6 số) và "Xem Bản Scan Dấu Đỏ".
  - [x] 4 Modal tác nghiệp chiến lược: Nghị Quyết Mở Bán Phân Khu Mới, Điều Chỉnh Khung Giá & Chiết Khấu Ngoại Giao, Thẩm Định Chi Tiết AI Rating Cho HĐQT, và Ký Số Điện Tử C-Level.
  - [x] Nút Xuất Báo Cáo Tài Chính HĐQT (.CSV) tải trực tiếp dữ liệu danh mục đại dự án chuẩn UTF-8 BOM.


---

### 9. Quản Lý Công Việc & Lịch Hẹn (`/tasks`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock UI & State Management (Zustand Store).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/tasks.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/tasks.md)
- **Mục tiêu**: Lên lịch hẹn dẫn khách xem sa bàn, điều phối xe Limousine tham quan dự án thực tế, chuẩn bị hồ sơ vay ngân hàng & công chứng HĐMB.
- **Mock Data**: 12 công việc thực tế phân loại đa chiều (Dẫn khách xem dự án, Hồ sơ vay ngân hàng, Công chứng ký HĐMB, Telesale & Chăm sóc, Sự kiện mở bán) liên kết trực tiếp danh bạ khách hàng và dự án.
- **Thành phần UI/UX**:
  - [x] Header điều hành với thanh lọc đa tiêu chí: Tìm kiếm tức thì, lọc theo Chuyên viên (Lê Hoàng Anh, Thanh Hà, Tuấn Tú,...), Mức độ ưu tiên (High, Medium, Low), và Phân loại nghiệp vụ.
  - [x] 5 Thẻ chỉ số vận hành: Tổng nhiệm vụ tháng, Khẩn cấp cần xử lý (High 🔥), Lịch dẫn khách tham quan (Tours), Hồ sơ vay & công chứng HĐMB, Hiệu suất thực thi đúng hạn SLA (93.8%).
  - [x] 4 Chế độ xem linh hoạt (Tabs):
    - **Bảng Kanban:** 4 cột kéo thả HTML5 Drag & Drop (Cần làm, Đang xử lý, Chờ duyệt, Hoàn tất) kèm nút đánh dấu hoàn thành nhanh.
    - **Danh Sách (List View):** Bảng chi tiết có checkbox tương tác gạch ngang khi xong.
    - **Lịch Tháng (Calendar View):** Lưới 31 ngày trực quan với sự kiện gắn theo màu sắc nhận diện nghiệp vụ.
    - **Sơ Đồ Gantt (Timeline View):** Tiến độ chuỗi tác nghiệp dự án trong 10 ngày tới.
  - [x] 3 Modal tác nghiệp chuyên sâu:
    - Modal tạo nhiệm vụ & lịch hẹn mới với đầy đủ thông tin khách hàng, dự án, giờ hẹn và địa điểm.
    - Modal xem chi tiết nhiệm vụ & tương tác checklist đầu việc con (Subtasks).
    - Modal đặt xe Limousine VIP / Cano cao tốc đưa đón nhà đầu tư tham quan thực địa.
  - [x] Nút Xuất Lịch Trình (.CSV) tải trực tiếp dữ liệu công việc chuẩn UTF-8 BOM.


---

### 10. Quy Trình Phê Duyệt Đa Cấp (`/workflow`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock UI & State Management (Zustand Store).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/workflow.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/workflow.md)
- **Mục tiêu**: Chuẩn hóa quy trình xin phê duyệt chiết khấu ngoại giao, đổi căn, hoàn tiền cọc thiện chí & tự động hóa kịch bản tiếp thị.
- **Mock Data**: Ma trận phê duyệt 4 cấp: *Cấp 1 (Trưởng phòng KD) ➔ Cấp 2 (Giám đốc sàn) ➔ Cấp 3 (Kế toán trưởng / GĐ Khối) ➔ Cấp 4 (Tổng Giám Đốc)* cùng cơ chế rẽ nhánh tự động (Threshold > 25 Tỷ hoặc Chiết khấu > 2.0%).
- **Thành phần UI/UX**:
  - [x] Header điều hành với các chỉ số KPI: Tổng phiếu trình duyệt tháng (6 phiếu), Đang chờ thẩm định, Giá trị BĐS đang duyệt (142.5 Tỷ), Tỷ lệ phê duyệt (87.5%), và Kịch bản tự động hóa active.
  - [x] 3 Chế độ xem linh hoạt (Tabs):
    - **Sổ Trình Duyệt (Approval Center):** Bộ lọc tìm kiếm theo mã phiếu, khách hàng, căn hộ; lọc theo Loại quy trình, Cấp duyệt và Trạng thái; Bảng chi tiết kèm nút Thẩm định.
    - **Sơ Đồ Luồng 4 Cấp Trực Quan (Visual Workflow Diagram):** Lưới 4 khối màu sắc nhận diện hiển thị rõ quyền hạn, hạn mức ủy quyền và thời gian SLA tối đa của từng cấp, cùng quy tắc rẽ nhánh tự động Bypass to CEO.
    - **Kịch Bản Tự Động Hóa (Automation Engine):** Trình thiết kế Trigger / Condition / Action trực quan với công tắc Bật/Tắt và nút Chạy Thử (Test).
  - [x] 2 Modal tác nghiệp chuyên sâu:
    - Modal lập phiếu trình duyệt chính sách đặc cách mới.
    - Modal thẩm định chi tiết tờ trình kèm timeline lịch sử các cấp và 3 nút: Phê Duyệt / Trả Về Bổ Sung / Từ Chối.
  - [x] Nút Xuất Sổ Phê Duyệt (.CSV) tải trực tiếp dữ liệu kiểm toán chuẩn UTF-8 BOM.


---

## GIAI ĐOẠN 3: CÔNG NGHỆ BẤT ĐỘNG SẢN TIÊN PHONG (PROPTECH & AI)

### 11. Bản Đồ Số Quy Hoạch BĐS (`/gis`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Leaflet 1.9 & Zustand Store).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/gis.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/gis.md)
- **Mục tiêu**: Trực quan hóa không gian địa lý, liên kết quy hoạch 1/500, hạ tầng liên vùng 2026-2030, heatmap giá đất & công cụ tìm kiếm không gian bằng AI.
- **Mock Data**: Tọa độ GPS thật của 5 siêu dự án (`NVW`, `AQC`, `TGM`, `VGP`, `TGC`), 4 tuyến hạ tầng trọng điểm và bản đồ chỉ tiêu 1/500 chi tiết.
- **Thành phần UI/UX**:
  - [x] Header điều hành tích hợp 4 thẻ KPI chiến lược: 5 Đại dự án GPS chuẩn, 4 Trục hạ tầng đột phá, 5.000 ha Sân bay Long Thành, +35% Biên độ tăng giá AI Forecast.
  - [x] Bản đồ tương tác Leaflet: Ghim vị trí 5 đại dự án với Custom HTML DivIcon phân biệt màu sắc, ảnh đại diện, doanh thu và nút "Rổ Hàng" / "Chi Tiết".
  - [x] 6 Lớp phủ hạ tầng (Vector Overlays): Tuyến Metro Số 1 (14 ga ngầm/nổi), Tuyến Vành Đai 3 TP.HCM (76.3 km), Cao tốc Dầu Giây - Phan Thiết (99 km), Vùng quy hoạch Sân bay Quốc tế Long Thành (5.000 ha), Bản đồ Heatmap giá đất, Vùng trũng ngập lụt triều cường.
  - [x] Hộp công cụ tìm kiếm không gian AI NLP (Spatial Search Engine): Phân tích câu lệnh tự nhiên, quét bán kính 2.5km, tự động Fly-to ống kính và hiển thị drawer kết quả match 98%.
  - [x] Danh mục siêu dự án (Project Directory Sidebar): Lọc theo phân vùng địa lý (Tất cả, TP.HCM, Đồng Nai, Phan Thiết) kèm nút "🎯 Định vị GPS" đưa ống kính Leaflet đến ngay vị trí thực.
  - [x] Modal "Tra Cứu Quy Hoạch Đất Đai 1/500": Bảng chi tiết quyết định phê duyệt, mật độ xây dựng (22.5% - 49.7%), hệ số FAR, tầng cao tối đa, tình trạng sổ hồng và nút tải bản vẽ CAD/PDF.
  - [x] Modal "Đo Khoảng Cách & Lộ Trình Di Chuyển": Tính toán thời gian ETA, cự ly km, các trục đường huyết mạch và phí cầu đường từ Chợ Bến Thành (Quận 1) đến từng dự án kèm chế độ định vị tuyến đường.

---

### 12. Virtual Tour 360 & Sa Bàn Số (`/panorama`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Three.js WebGL & Zustand Store).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/panorama.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/panorama.md)
- **Mục tiêu**: Trải nghiệm thực tế ảo xem căn hộ mẫu 360°, đo laser không gian, sa bàn ảo 3D tổng thể & giữ chỗ căn hộ tức thì.
- **Mock Data**: 4 Siêu dự án chuẩn mực (`p1` NovaWorld Phan Thiet, `p3` The Grand Manhattan, `p2` Aqua City, `p5` The Global City) với danh mục phòng, thông số trần, bề ngang, diện tích, quy chuẩn bàn giao và các phân khu 3D.
- **Thành phần UI/UX**:
  - [x] Màn hình thực tế ảo 360 tương tác chuột xoay các hướng (Three.js / WebGL / WebXR Canvas).
  - [x] Chuyển đổi 2 chế độ linh hoạt: **Căn Hộ Mẫu 360°** vs **Sa Bàn Ảo 3D Tổng Thể**.
  - [x] Điểm chuyển cảnh 3D (Room Portal Hotspots): Bấm trực tiếp trên không gian 3D để chuyển từ Phòng khách ➔ Ban công view biển ➔ Phòng ngủ Master ➔ Hồ bơi vô cực.
  - [x] Điểm ghim vật liệu bàn giao (Handover Spec Hotspots): Chạm vào đá Marble Carrara Ý, Kính Low-E 3 lớp, Khóa thông minh Hafele để mở bảng thẩm định thương hiệu và bảo hành.
  - [x] Thước đo laser 3D (Laser Measure): Bật/tắt đường tia laser dạ quang đo đạc bề ngang (5.2m - 8m), trần cao (3.6m - 4.2m) và diện tích phòng.
  - [x] Bộ tổng hợp âm thanh thiên nhiên bằng Web Audio API (Native Ocean Breeze Synthesizer - không phụ thuộc file mp3).
  - [x] Radar 2D góc màn hình: Đo góc xoay camera thời gian thực qua hook `useFrame()` xoay hình nón quét (FoV) trên sơ đồ mặt bằng căn hộ.
  - [x] Chế độ Ngày / Đêm (Day / Night switch), Tự động quay 360° (Auto-Rotate) và Xem toàn màn hình (Fullscreen).
  - [x] Sa bàn số 3D (Digital Master Plan 3D): Khám phá mô hình phân khu, tỷ lệ đã bán (78% - 95%) và giá rumor từng phân khu kèm nút 1-click vào căn hộ mẫu.
  - [x] Modal "Giữ Căn & Khóa Chỗ Tức Thì" (`addBookingTicket`): Tự động điền mã căn, giá niêm yết, chọn khách hàng VVIP và nộp cọc 100 triệu có banner điều hướng `/booking`.
  - [x] Modal "Chia Sẻ VR Tour": Mã QR Code chuẩn cho mobile gyroscope, link 1-click copy và nút gửi Zalo / SMS.
  - [x] Modal "Cuộc Gọi Video Tư Vấn 1-1 & Co-browsing WebRTC": Đồng bộ góc quay 360° theo thời gian thực giữa chuyên viên và khách hàng.
  - [x] Nút "Tải Mặt Bằng Kiến Trúc (PDF/CAD)" với phản hồi toast.

---

### 13. Trợ Lý AI Chuyên Sâu BĐS (`/ai-knowledge`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (RAG Engine & Vector Store).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/ai-knowledge.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/ai-knowledge.md)
- **Mục tiêu**: Trợ lý AI giải đáp tức thì chính sách bán hàng, lập phương án dòng tiền ngân hàng, đối soát pháp lý 1/500 và so sánh đa chiều các đại dự án.
- **Mock Data**: Bộ tri thức 6 tài liệu thực tế (CSBH Aqua City, Brochure Global City, Bảng giá phân khu 2, Luật Kinh doanh BĐS, Quyết định 1/500, FAQ môi giới) với 12.450 chunks vector hóa.
- **Thành phần UI/UX**:
  - [x] Header điều hành tích hợp 4 thẻ KPI AI: 12.450 Chunks Vectorized, 98.6% Độ Tin Cậy, 100% Trích Dẫn Nguồn Gốc, < 1.2s Tốc Độ Phản Hồi.
  - [x] Kho dữ liệu nguồn (Knowledge Base): Bộ lọc theo danh mục (Tất cả, CSBH, Bảng giá, Pháp lý, Quy hoạch 1/500), ô tìm kiếm tài liệu, hiển thị dung lượng, ngày cập nhật và trạng thái Đã học / Đang học / Lỗi.
  - [x] Khung chat AI Copilot với 5 Prompt Chips gợi ý nhanh:
    - *"So sánh chính sách thanh toán Aqua City và The Global City"*
    - *"Tính dòng tiền vay ngân hàng cho căn Shophouse 12 tỷ"*
    - *"Căn hộ Grand Manhattan có được cấp sổ hồng sở hữu lâu dài không?"*
    - *"Phân tích tiềm năng tăng giá NovaWorld Phan Thiết khi cao tốc thông xe"*
    - *"Chính sách chiết khấu thanh toán sớm 95% áp dụng thế nào?"*
  - [x] Câu trả lời hiển thị bảng Markdown 3 cột, danh sách bullet points, in đậm số liệu tài chính rõ ràng.
  - [x] Khối trích dẫn nguồn (Citations): Huy hiệu tài liệu nguồn click vào mở **Modal Tra Cứu Trích Dẫn (Citation Inspector)** hiển thị số trang, độ tương đồng ngữ nghĩa Cosine Similarity và đoạn văn gốc.
  - [x] Thanh tác vụ trên từng tin nhắn AI: Nút Sao Chép 1-click có phản hồi toast, Nút Gửi Zalo VIP định dạng đẹp cho khách hàng.
  - [x] Modal "Nạp Tài Liệu Tri Thức Mới": Chọn loại tài liệu, liên kết dự án, kéo thả file tải lên và tự động chuyển trạng thái học dữ liệu.
  - [x] Modal "Xuất Báo Cáo Tư Vấn (PDF Memo)": Chọn khách hàng VVIP trong CRM, xuất bản file Báo cáo tư vấn PDF có tiêu ngữ, chữ ký số chuyên viên và mộc công ty.

---

### 14. Document AI & OCR Giấy Tờ (`/document-ai`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Vision AI & Zustand Store).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/document-ai.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/document-ai.md)
- **Mục tiêu**: Tự động bóc tách thông tin từ ảnh chụp CCCD gắn chip (12 số), Hộ chiếu quốc tế, Sổ hồng (GCNQSDĐ) và tự động điền form hợp đồng, loại bỏ 100% rủi ro sai sót gõ tay.
- **Mock Data**: 4 Mẫu chứng từ thực tế (CCCD VVIP Nguyễn Văn Tuấn, CCCD VIP Trần Thị Bích Ngọc, Sổ hồng Biệt thự Florida NovaWorld, Hộ chiếu quốc tế Singapore Michael Chen) với độ chính xác trường 98.9% - 99.9%.
- **Thành phần UI/UX**:
  - [x] Header điều hành tích hợp 4 thẻ KPI Document AI: 1.840 Hồ Sơ Đã Xử Lý, 99.4% Độ Chính Xác OCR, 2.1 Giây Tốc Độ Xử Lý, 0 Lỗi Nhập Liệu Hợp Đồng.
  - [x] Thanh chọn mẫu chứng từ nhanh: Chuyển đổi linh hoạt giữa CCCD gắn chip, Sổ hồng bất động sản, và Hộ chiếu quốc tế.
  - [x] Cột trái - Vùng quét giấy tờ (Document Viewport): Trình xem tài liệu trực quan, hiệu ứng chùm tia laser xanh dạ quang chạy dọc khi quét, và các khung Bounding Box phát sáng có nhãn độ tin cậy.
  - [x] Cột phải - Form dữ liệu bóc tách chuẩn hóa: Tự động điền dữ liệu theo loại giấy tờ (Cá nhân hoặc Thửa đất/Tờ bản đồ/Diện tích), cho phép chỉnh sửa trực tiếp.
  - [x] Nút "Lưu Hồ Sơ Khách Hàng" (`addCustomer`): Tự động tạo hồ sơ khách hàng mới trong CRM, sinh mã `KH-xxx` có phản hồi toast.
  - [x] Nút "Tạo Hợp Đồng Tự Động" (`addContract`): Mở Modal cấu hình dự án, mã căn và giá trị, tạo ngay hợp đồng cọc pháp lý với Bên Mua đã điền sẵn từ OCR.
  - [x] Modal "Trích Xuất JSON Schema": Xem raw JSON response payload chuẩn Google Cloud Document AI / Azure AI Document Intelligence kèm nút Sao chép 1-click.
  - [x] Bảng nhật ký quét giấy tờ gần đây (OCR Audit Logs): Lưu lại 5 giao dịch trích xuất gần nhất phục vụ đối soát kiểm toán nội bộ.

---

### 15. Tính Toán Lãi Vay & Dòng Tiền Đầu Tư (`/mortgage`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Thuật toán tài chính & UI/UX tương tác (Amortization & Zustand Store).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/mortgage.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/mortgage.md)
- **Mục tiêu**: Công cụ cố vấn tài chính chuyên sâu cho khách mua nhà và nhà đầu tư BĐS: mô phỏng chính sách hỗ trợ lãi suất 0% & ân hạn nợ gốc CĐT (18-24 tháng), lịch trả góp theo dư nợ giảm dần, thẩm định tỷ lệ nợ trên thu nhập (DTI), và bài toán hiệu suất cho thuê (Rental Yield ROI).
- **Mock Data**: 4 Ngân hàng đối tác chiến lược (MBBank, VPBank, Techcombank, Vietcombank) kèm chính sách ưu đãi thực tế, liên kết động với rổ hàng thực tế (`NVW-FL-102`, `AQC-RP-045`,...).
- **Thành phần UI/UX**:
  - [x] Header điều hành tích hợp 4 thẻ KPI tài chính: 0% Lãi Suất CĐT 24M, 7.2% Rental Yield Ròng, +22.2% Tổng Sinh Lời/Năm, 8.5 Năm Thu Hồi Vốn Đầu Tư.
  - [x] Bộ điều khiển thông số tài chính linh hoạt: Thanh trượt chọn Giá trị BĐS (3 - 50 Tỷ), Tỷ lệ vay (50% - 80%), Thời hạn vay (5 - 30 năm), Thu nhập hàng tháng.
  - [x] Nút chọn nhanh BĐS từ Rổ hàng thực tế (`inventory`): Tự động nạp giá trị căn hộ và mã căn để tính toán.
  - [x] Công tắc "Chính Sách Hỗ Trợ 0% CĐT": Mô phỏng giải pháp 0 đồng/tháng trong 18-24 tháng đầu tiên.
  - [x] Ma trận so sánh 4 Ngân hàng đối tác: MBBank, VPBank, Techcombank, Vietcombank với lãi suất sau ưu đãi và hạn mức vay tối đa.
  - [x] Tab 1 - Lịch Trả Nợ & Biểu Đồ Dư Nợ: Biểu đồ AreaChart dư nợ giảm dần qua 25 năm + Bảng phân bổ gốc lãi chi tiết 12 tháng đầu có nhãn 0% LS CĐT.
  - [x] Tab 2 - Bài Toán Dòng Tiền & Cho Thuê: Giá thuê kỳ vọng, chi phí vận hành 10%, Net Rental Yield %, Tăng giá vốn hàng năm (+15%), Tổng ROI/năm (+22.2%), Thời gian hoàn vốn.
  - [x] Kiểm tra an toàn tài chính DTI: Khuyến nghị chỉ số trả nợ / thu nhập (An toàn < 40%, Chấp nhận được 40-50%, Rủi ro > 50%).
  - [x] Modal "Xuất Báo Cáo Phương Án Tài Chính (PDF Memo)": Tạo tài liệu cố vấn tài chính chuẩn có dấu mộc công ty và chữ ký số.
  - [x] Modal "Chia Sẻ Phương Án Qua Zalo VIP": Định dạng tin nhắn tư vấn dòng tiền sang trọng gửi thẳng đến Zalo khách hàng.

---

### 15B. Dữ Liệu Thị Trường & Định Giá (`/market-data`)
- [ ] **Mục tiêu**: Cung cấp bức tranh dữ liệu giá đất, chỉ số sinh lời và so sánh biến động giá các khu vực.
- **Mock Data**: Dữ liệu giá bán trung bình/m² của TP. Thủ Đức, Đồng Nai, Phan Thiết từ 2021 đến 2026.
- **Thành phần UI/UX**:
  - [ ] Biểu đồ đường biến động giá đất theo thời gian (Line Chart Recharts).
  - [ ] Công cụ định giá nhanh: Chọn khu vực, loại hình (nhà phố/biệt thự/căn hộ), diện tích ➔ Ước tính giá thị trường.

---

## GIAI ĐOẠN 4: TIẾP THỊ, KHÁCH HÀNG & MẠNG LƯỚI ĐỐI TÁC

### 16. Chiến Dịch Marketing & Phân Bổ Lead Tự Động (`/marketing`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Thuật toán Omnichannel & Smart Lead Routing (Zustand Store).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/marketing.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/marketing.md)
- **Mục tiêu**: Quản trị chiến dịch quảng cáo đa kênh Facebook Ads, Google Search, TikTok Ads, Zalo OA; tối ưu chi phí CPL; đo lường phễu chuyển đổi 6 giai đoạn và phân bổ Lead tự động (Smart Lead Routing) kèm cơ chế SLA 15 phút.
- **Mock Data**: 4 Chiến dịch thực tế phân bổ ngân sách 100 triệu, 6 Inbound Leads nóng đổ về thời gian thực, chuỗi số liệu 7 ngày CPL/Leads, và 4 mẫu Landing Page BĐS.
- **Thành phần UI/UX**:
  - [x] Header điều hành với 4 thẻ KPI chiến lược: Ngân Sách Đã Tiêu (56.7 Triệu/100 Triệu), Tổng Leads Thu Về (503 Leads, +18.4%), CPL Trung Bình (112.723 VNĐ, -34.2% so với trần), Tỷ Lệ Chuyển Đổi Booking (8.34%, 42 Booking).
  - [x] 4 Tabs tác nghiệp toàn diện:
    - **Tab 1: Hiệu Suất Chiến Dịch (Campaigns & Channels)**: Bộ lọc đa chiều theo từ khóa, nền tảng (Facebook, Google, TikTok, Zalo) và trạng thái; Thẻ chiến dịch chi tiết có tiến độ ngân sách, Clicks, Leads, CPL thực tế vs Trần, công tắc Bật/Tạm dừng trực tiếp; Biểu đồ Recharts AreaChart 7 ngày CPL/Leads; Biểu đồ cơ cấu kênh; Phễu chuyển đổi toàn trình 6 nấc từ Impressions đến Ký HĐMB.
    - **Tab 2: Sổ Leads Nóng & Smart Lead Routing (Live Inflow)**: Bảng theo dõi Lead nóng theo thời gian thực có đếm ngược SLA 15 phút, cảnh báo nguy cấp/quá hạn; Nút gọi điện tức thì; Nút điều chuyển chuyên viên (Re-assign) linh hoạt.
    - **Tab 3: Trình Tạo UTM, QR Code & Pixels**: Dynamic UTM Builder sinh link tự động theo source/medium/campaign/content; QR Code Vector Standee có nút Tải ảnh PNG và In ấn sự kiện; Hub kiểm tra trạng thái Meta CAPI, Google Tag Manager, TikTok Pixel, Zalo Webhook với nút Ping Test đo độ trễ.
    - **Tab 4: Mẫu Landing Page BĐS**: 4 Template dự án đẳng cấp (Grand Manhattan, Aqua City, NovaWorld Phan Thiết, The Global City); Khung điện thoại iPhone 16 Pro xem trước responsive có Dynamic Island và Form đăng ký tư vấn.
  - [x] 4 Modal tương tác không có nút chết:
    - Modal 1: Khởi tạo chiến dịch marketing mới (lưu vào Zustand store `addCampaign`).
    - Modal 2: Cấu hình Smart Lead Routing Engine (Top Seller 50/30/20, Round-Robin, Project Match, SLA 10-30 phút, Auto Re-assign).
    - Modal 3: Giả lập bắn Lead khách hàng mẫu (`addLeadToCampaign` + tự động sinh hồ sơ khách hàng `addCustomer` trong CRM).
    - Modal 4: Điều chuyển Lead cho chuyên viên khác có ghi nhận thời điểm.
  - [x] Nút Xuất Báo Cáo CSV (`handleExportCSV`): Tải trực tiếp báo cáo chiến dịch định dạng UTF-8 BOM.

---

### 17. CMS Tin Tức, Sự Kiện & Banner (`/cms`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Zustand Store & SEO Engine).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/cms.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/cms.md)
- **Mục tiêu**: Cổng thông tin tin tức thị trường BĐS, cẩm nang đầu tư, tối ưu hóa công cụ tìm kiếm Google SERP theo thời gian thực và quản trị biển bảng banner/popups.
- **Mock Data**: 5 Bài viết phân tích thị trường chuyên sâu, 3 Banner/Popups quảng cáo đa dạng (Hero, Modal, Exit Intent), 2 Landing Pages đo lường CVR.
- **Thành phần UI/UX**:
  - [x] Header điều hành tích hợp 4 thẻ KPI: Kho Bài Viết (5 bài, 4 xuất bản, 1 nháp), Tổng Lượt Đọc (12.260 Views, +24.8% organic), Điểm SEO Onpage TB (88/100), Leads Thu Về Từ Landing Page (365 Leads).
  - [x] 3 Tabs tác nghiệp toàn diện:
    - **Tab 1: Bài Viết & SEO Simulator**: Bộ lọc 3 chiều (Từ khóa, Chuyên mục Thị trường/Tài chính/Tiến độ, Trạng thái); Danh sách bài viết có thumbnail, lượt xem, điểm SEO; Cột phải: Trình mô phỏng Google SERP thời gian thực với khung Snippet giống Google thật, tính điểm Onpage SEO tự động (Title 50-65 ký tự, Meta 120-165 ký tự) và nút "Lưu Thiết Lập SEO".
    - **Tab 2: Trang Đích (Landing Pages)**: Thẻ trang đích với lượt truy cập, leads thu về, tỷ lệ CVR, nút Bật/Tắt Live, nút Cài đặt Form, nút Sửa Giao Diện.
    - **Tab 3: Biển Bảng & Popups**: Quản lý Hero Banner, Modal Popup, Exit Intent; công tắc Bật/Tắt trực tiếp; nút Xem Thử ảnh lớn.
  - [x] 5 Modal tương tác không có nút chết:
    - Modal 1: Soạn thảo bài viết mới (`addArticle` lưu vào store).
    - Modal 2: Chỉnh sửa bài viết (`updateArticle`).
    - Modal 3: Bản xem trước bài viết chuẩn báo chí BĐS (tạp chí cao cấp có ảnh bìa, sapo, nội dung phân tích, form nhận bảng giá cuối bài).
    - Modal 4: Thêm banner/popup quảng cáo mới (lưu vào danh sách).
    - Modal 5: Khởi tạo Landing Page mới (`addLandingPage`).
  - [x] Nút Xuất Báo Cáo CSV (`handleExportCSV`): Tải trực tiếp file danh mục bài viết và kiểm toán SEO chuẩn UTF-8 BOM.

---

### 18. Sự Kiện Mở Bán & Check-in QR (`/events`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Optical Scanner & Seating Matrix).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/events.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/events.md)
- **Mục tiêu**: Quản lý sự kiện mở bán tập trung tại khách sạn 5 sao, quét mã QR check-in khách VVIP tốc độ cao, hiển thị tức thì vị trí bàn tiệc, số ghế, quà tặng và sơ đồ chỗ ngồi khán phòng thời gian thực.
- **Mock Data**: 3 Sự kiện quy mô lớn (Open House Aqua 2, Webinar Nghỉ dưỡng 2026, Workshop Phong thủy Caravelle), 6 Khách mời danh dự (VVIP, VIP, Tiêu Chuẩn), ma trận 6 bàn tiệc khán phòng Grand Castiglione.
- **Thành phần UI/UX**:
  - [x] Header điều hành tích hợp 4 thẻ KPI: Tổng Sự Kiện (3 sự kiện), Lượt Khách Đăng Ký (1.770 khách), Tỷ Lệ Check-in Show-up (87%), Khách VVIP Đã Đón Tiếp (148 VVIP).
  - [x] 4 Tabs tác nghiệp toàn diện:
    - **Tab 1: Trạm Quét QR Trực Tiếp**: Live Optical Camera 60 FPS với hiệu ứng chùm tia laser xanh neon quét dọc; Thanh phím tắt quét nhanh 4 vé mẫu (`VVIP-888`, `VIP-999`, `VIP-102`, `STD-405`); Form nhập thủ công; Cột phải: Lịch sử đón khách thời gian thực có nhãn VVIP mạ vàng, quà tặng và số bàn ghế.
    - **Tab 2: Danh Sách Khách Mời & Thẻ Vé**: Bảng danh sách chi tiết có bộ lọc 3 chiều (Tìm kiếm, Hạng vé VVIP/VIP/Tiêu chuẩn, Trạng thái Check-in); Nút Check-in 1-click; Nút Xem Thẻ Vé Điện Tử.
    - **Tab 3: Sơ Đồ Bàn Tiệc & Ghế (Seating Matrix)**: Lưới 6 bàn tiệc tròn 10 người (Bàn VVIP 01 trung tâm sân khấu, Bàn VIP 02 - 04, Bàn Standard 05 - 06); Trực quan hóa 10 ghế quanh bàn tròn với màu xanh = Đã có mặt, xám = Trống; Tỷ lệ lấp đầy bàn.
    - **Tab 4: Danh Mục Sự Kiện**: Lưới thẻ sự kiện chi tiết kèm ngày giờ, địa điểm, sức chứa, tiến độ check-in, nút "Mở Trạm Quét" đồng bộ ngay vào scanner.
  - [x] 4 Modal tương tác không có nút chết:
    - Modal 1: Khởi tạo sự kiện mới (`addEvent` lưu vào store).
    - Modal 2: Thêm khách mời & cấp vé QR mới (liên kết với danh bạ CRM `customers`).
    - Modal 3: Thẻ vé mời điện tử dát vàng (Luxury E-Ticket) có mã QR vector, nút Gửi Zalo VIP và Tải PDF.
    - Modal 4: Pop-up chào đón khách VVIP sau khi quét vé thành công (xác nhận bàn tiệc, số ghế, quà tặng tri ân và nút "In Thẻ Đeo Tức Thì").
  - [x] Nút Xuất Báo Cáo CSV (`handleExportCSV`): Tải trực tiếp file danh sách điểm danh sự kiện định dạng UTF-8 BOM.

---

### 19. Chương Trình Hội Viên & Loyalty (`/loyalty`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Zustand Store & Tiered Engine).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/loyalty.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/loyalty.md)
- **Mục tiêu**: Chăm sóc khách hàng thân thiết đa tầng (Silver, Gold, Diamond, Signature), cơ chế tích lũy điểm NovaPoints dựa trên giá trị hợp đồng giao dịch BĐS (0.1%), đổi voucher thượng lưu và sổ nhật ký kiểm toán điểm minh bạch.
- **Mock Data**: 8 Voucher đặc quyền chuẩn thượng lưu (biệt thự Novaworld, du thuyền Aqua Marina, sân golf PGA 36 hố, phòng chờ sân bay quốc tế, chiết khấu 2% BĐS...), 5 giao dịch tích/tiêu điểm, 4 khách hàng VIP với mức điểm phân tầng.
- **Thành phần UI/UX**:
  - [x] Header điều hành tích hợp 4 thẻ KPI chiến lược: Điểm Khả Dụng (245.000 PTS), Hạng Hội Viên (Silver, Gold, Diamond, Signature), Tổng Điểm Tích Lũy Lũy Kế (+325.000 PTS), Voucher Đã Đổi.
  - [x] Thanh chuyển đổi tài khoản khách hàng VIP mô phỏng (Customer Switcher Dropdown): Chuyển đổi giữa 4 hồ sơ VIP (`c1` Nguyễn Văn Tuấn - Signature 650k PTS, `c2` Trần Thị Bích Ngọc - Diamond 245k PTS, `c4` Phạm Minh Tuấn - Gold 135k PTS, `c5` Hoàng Thị Mai - Silver 45k PTS) có cập nhật thẻ và điểm tức thì.
  - [x] Thẻ hội viên số hóa đa tầng (Luxury Digital Pass): 4 theme gradient kim loại cao cấp, chip bảo mật Contactless VIP, mã số thẻ `NVL-8899-2026-VIP` và nút mở QR Pass.
  - [x] Thẻ tiến độ thăng hạng (Tier Progression Bar): % tiến trình thời gian thực, số điểm cần tích lũy thêm và danh sách đặc quyền hiện có của từng hạng thẻ.
  - [x] 4 Tabs tác nghiệp toàn diện:
    - **Tab 1: Cửa Hàng Quà Tặng (Rewards Catalog)**: Bộ lọc 8 danh mục (Nghỉ dưỡng, Nội thất, Hàng không, Chiết khấu BĐS, Golf, Du thuyền, Sức khỏe, Giải trí) + Tìm kiếm từ khóa; Thẻ quà tặng có huy hiệu danh mục, điểm quy đổi, số lượng còn lại, nút "Đổi Quà Ngay" hoặc nhãn "Thiếu ... PTS".
    - **Tab 2: Túi Quà Đã Đổi (My E-Gift Wallet)**: Quản lý danh sách voucher đã sở hữu, hiển thị mã E-Code duy nhất, hạn sử dụng, nút Sao chép mã và nút Mở Mã QR kích hoạt tại quầy lễ tân.
    - **Tab 3: Sổ Nhật Ký Tích & Tiêu Điểm (Loyalty Ledger)**: Bảng kiểm toán biến động điểm thời gian thực với bộ lọc Tất cả / Tích (+) / Tiêu (-) và tìm kiếm theo mã tham chiếu.
    - **Tab 4: Bảng So Sánh Quyền Lợi 4 Hạng Thẻ (Tier Privilege Matrix)**: Bảng ma trận so sánh chi tiết giữa Silver, Gold, Diamond, Signature về tỷ lệ chiết khấu mua thêm BĐS (1.0% - 3.5%), phòng chờ sân bay, du thuyền, sân golf và quản gia 24/7.
  - [x] 4 Modal tương tác không có nút chết:
    - Modal 1: Giả lập tích điểm giao dịch BĐS (`earnLoyaltyPoints` dựa trên giá trị hợp đồng và tỷ lệ 0.05% - 0.5%).
    - Modal 2: Thêm quà tặng / voucher mới vào catalog (`addVoucher`).
    - Modal 3: Chi tiết thẻ hội viên & Digital Pass QR (mô phỏng liên kết thẻ vào Apple Wallet / Google Wallet).
    - Modal 4: Popup đổi voucher thành công với mã E-Code và nút sao chép 1-click.
    - Modal 5: Popup mở mã QR trong ví để sử dụng tại quầy lễ tân.
  - [x] Nút Xuất Báo Cáo CSV (`handleExportCSV`): Tải trực tiếp sao kê lịch sử tích tiêu điểm chuẩn UTF-8 BOM.

---

### 20. Affiliate & Mạng Lưới Cộng Tác Viên (`/referral`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Zustand Store & Affiliate Engine).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/referral.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/referral.md)
- **Mục tiêu**: Kích hoạt mạng lưới cộng tác viên giới thiệu khách mua nhà hưởng hoa hồng tự động (1.2% - 1.5%), quy trình giải ngân 2 đợt (30% cọc - 70% giải ngân), cấp link & QR định danh theo từng dự án, ví rút hoa hồng và đường đua vinh danh doanh số.
- **Mock Data**: 7 Deals khách hàng giới thiệu thực tế (`ref-1` đến `ref-7`), 3 lượt rút hoa hồng, chuỗi số liệu 5 tuần traffic vs deal, và bảng xếp hạng Top 5 CTV toàn hệ thống.
- **Thành phần UI/UX**:
  - [x] Header điều hành tích hợp 4 thẻ KPI chiến lược: Tổng Hoa Hồng Tích Lũy (889.8 Triệu VNĐ), Khách Hàng Đã Giới Thiệu (7 khách), Tỷ Lệ Chốt Thành Công (71.4%), Cấp Bậc Đối Tác (Diamond Partner).
  - [x] Thẻ CTV cá nhân hóa: Mã CTV `TUANTU99`, link tiếp thị định danh gắn cookie 90 ngày, nút tải mã QR PNG và nút chia sẻ nhanh Zalo VIP.
  - [x] Thẻ Ví Hoa Hồng Khả Dụng: Số dư rút ngay (245.000.000 VNĐ), số tiền chờ giải ngân (495.000.000 VNĐ), tài khoản Vietcombank liên kết và nút Rút tiền.
  - [x] Đường đua doanh số Gamification (Tháng 7/2026): Thanh tiến trình 4 mốc thi đua với phần thưởng Voucher 5 triệu, iPhone 16 Pro Max, Tour Maldives 5 sao và 01 Cây Vàng SJC 9999.
  - [x] Biểu đồ kép AreaChart Recharts: Theo dõi 5 tuần tăng trưởng traffic click link vs deal chốt thành công trên 2 trục tung độc lập.
  - [x] 4 Tabs tác nghiệp toàn diện:
    - **Tab 1: Sổ Deal Giới Thiệu (Referred Deals Ledger)**: Bộ lọc đa chiều theo từ khóa (tên, SĐT, mã căn), đại dự án, trạng thái deal (Đã giải ngân, Đã đặt cọc, Đang tư vấn, Hủy) và trạng thái thanh toán (Đã trả, Chờ giải ngân, Chưa phát sinh); Bảng chi tiết kèm nút xem Chi tiết.
    - **Tab 2: Bộ Link & QR Dự Án (Project Marketing Hub)**: Trình tạo liên kết tiếp thị riêng cho từng đại dự án (Aqua City, The Global City, NovaWorld Phan Thiet, The Beverly) có gắn tham số UTM; Trình tải Brochure bán hàng PDF và Video Flycam 4K; Mẫu bài viết tư vấn xúc động có nút sao chép 1-click.
    - **Tab 3: Lịch Sử Chi Trả Hoa Hồng (Payouts)**: Danh sách lệnh rút tiền có số tiền, tài khoản Vietcombank, ngày yêu cầu, trạng thái và nút Xem Ủy Nhiệm Chi (UNC).
    - **Tab 4: Bảng Vàng CTV (Leaderboard)**: Bảng vinh danh Top 5 cộng tác viên xuất sắc nhất tháng với số deal chốt và doanh thu hoa hồng.
  - [x] 4 Modal tương tác không có nút chết:
    - Modal 1: Đăng ký khách hàng giới thiệu mới (`addReferralLead`, tự động đồng bộ hồ sơ khách hàng mới vào CRM `customers`).
    - Modal 2: Yêu cầu rút tiền hoa hồng (`requestCommissionPayout` gửi đến Kế toán thẩm định).
    - Modal 3: Chi tiết hồ sơ deal BĐS (lộ trình giải ngân 2 đợt 30% - 70% và nút Hối thúc tiến độ CSKH).
    - Modal 4: Biên lai ủy nhiệm chi UNC ngân hàng Vietcombank đầy đủ thông tin giao dịch điện tử.
  - [x] Nút Xuất Báo Cáo CSV (`handleExportCSV`): Tải trực tiếp báo cáo deal và hoa hồng định dạng UTF-8 BOM.

---

### 21. Sàn Giao Dịch Bán Chéo F2 (`/marketplace`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Zustand Store & Co-brokering Engine).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/marketplace.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/marketplace.md)
- **Mục tiêu**: Sàn kết nối B2B giữa tổng đại lý phân phối F1 và mạng lưới đại lý liên kết F2, chia sẻ rổ hàng độc quyền & thứ cấp, thỏa thuận ký quỹ hoa hồng Escrow (50/50, 40/60) và cơ chế bảo vệ nguồn khách hàng 90 ngày.
- **Mock Data**: 8 Sản phẩm BĐS bán chéo cao cấp (Penthouse Aqua City, Biệt thự The Global City, Shophouse Sala, Duplex Masteri Thảo Điền, Dinh thự Grand Manhattan...), 8 đại lý đối tác chiến lược (Khải Hoàn Land, Rever, SmartLand, Savills, ERA, Đất Xanh, IQI, Phú Hoàng Land) và chuỗi dữ liệu GMV 7 tháng.
- **Thành phần UI/UX**:
  - [x] Header điều hành tích hợp 4 thẻ KPI chiến lược: Tổng Sản Phẩm Bán Chéo (1.245 Sản phẩm), Giao Dịch Chéo Thành Công (420 Deals, GMV 4.520 Tỷ VNĐ), Đại Lý F1/F2 Tham Gia (3.850+ Môi giới), Hoa Hồng Đã Chia Sẻ (89.5 Tỷ VNĐ).
  - [x] 4 Tabs tác nghiệp toàn diện:
    - **Tab 1: Rổ Hàng Bán Chéo F1/F2 (Co-brokering Exchange)**: Bộ lọc đa chiều 4 tầng (Hình thức Bán/Cho thuê, Phân khúc Căn hộ/Biệt thự/Shophouse/Dinh thự, Khu vực TP. Thủ Đức/Quận 1/Đồng Nai/Phan Thiết, Khoảng giá); Thẻ sản phẩm B2B có tỷ lệ chia sẻ hoa hồng (50/50), hoa hồng F2 thực nhận (1.2% - 2.0%), dấu tích F1 xác thực, nút Chi tiết và nút Nhận Bán Chéo.
    - **Tab 2: Hàng Tôi Nhận Phân Phối (My Distributed Inventory)**: Quản lý các sản phẩm đã ký hợp đồng phân phối, thời hạn bảo vệ độc quyền khách hàng 90 ngày, nút tải bảng hàng và tài liệu bán hàng.
    - **Tab 3: Mạng Lưới Sàn & Đại Lý Liên Kết (Agency Directory)**: Danh bạ 8 đại lý hàng đầu kèm điểm rating sao (4.4 - 5.0), số deal thành công, phân hạng F1/F2/Global Partner, nút Gọi hotline, Nhắn tin và Mời Hợp Tác Bán Chéo.
    - **Tab 4: Phân Tích & GMV Chợ B2B (Market Analytics)**: Biểu đồ AreaChart tăng trưởng sản phẩm & GMV qua 7 tháng (T1 - T7); Biểu đồ BarChart phân bổ cơ cấu GMV theo 4 phân khúc BĐS.
  - [x] 4 Modal tương tác không có nút chết:
    - Modal 1: Ký thỏa thuận phân phối bán chéo Co-brokering Escrow Agreement (`requestDistributionRights`, cam kết không luồn cò, bảo vệ khách 90 ngày và tự động gắn nhãn "Đã Nhận Phân Phối").
    - Modal 2: Đăng nguồn hàng bán chéo mới lên sàn B2B (`addMarketplaceListing` lưu vào Zustand store).
    - Modal 3: Chi tiết sản phẩm & pháp lý (giá niêm yết, tiêu chuẩn bàn giao, hotline F1).
    - Modal 4: Gửi thư mời hợp tác đại lý B2B kèm nội dung tùy chỉnh.
  - [x] Nút Xuất Báo Cáo CSV (`handleExportCSV`): Tải trực tiếp danh mục rổ hàng bán chéo định dạng UTF-8 BOM.

---

### 22. Khảo Sát Khách Hàng & Chỉ Số NPS (`/surveys`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Zustand Store & AI NLP CX Engine).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/surveys.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/surveys.md)
- **Mục tiêu**: Đo lường trải nghiệm khách hàng đa kênh (CX), tính toán thời gian thực tam giác chỉ số cốt lõi NPS (-100 đến +100), CSAT (% Hài lòng), CES (Customer Effort Score 1-7), phân tích cảm xúc từ khóa AI NLP, kích hoạt tự động theo hành trình giao dịch và xử lý khiếu nại Red Alert chuẩn SLA 24h.
- **Mock Data**: 8 Đánh giá thực tế đa kênh (The Grand Manhattan, Aqua City, The Global City, Vinhomes Grand Park, Eco Green Saigon, Novaworld Phan Thiết...), 5 chiến dịch khảo sát tự động hóa kịch bản, và chuỗi dữ liệu 6 tháng xu hướng CSAT/NPS.
- **Thành phần UI/UX**:
  - [x] Header điều hành tích hợp 4 thẻ KPI chiến lược: Chỉ Số NPS Tự Động (+58, Xuất Sắc), Tỷ Lệ Hài Lòng CSAT (92%, +4.2% MoM), Đánh Giá Trung Bình (4.8 / 5.0 ⭐, 5 sao scale), Thủ Tục Tiện Lợi CES (5.9 / 7.0, An Toàn).
  - [x] 4 Tabs tác nghiệp toàn diện:
    - **Tab 1: Tổng Quan NPS & AI Sentiment Analyzer**: Phân rã cơ cấu NPS 3 nhóm (Promoters 63%, Passives 25%, Detractors 13%); Công thức chuẩn Bain & Company; Thẻ AI Insights trích xuất điểm sáng & cảnh báo dịch vụ; Biểu đồ Recharts AreaChart xu hướng 6 tháng CSAT/NPS; Biểu đồ BarChart tỷ trọng kênh thu thập (Zalo ZNS, Post-Sale Form, Google Review, Showroom Kiosk, SMS Link); Bản đồ cụm từ khóa khách hàng nhắc đến nhiều nhất (NLP Word Cloud).
    - **Tab 2: Sổ Phản Hồi Đa Kênh & Live Feed**: Bộ lọc đa chiều 5 tầng (Tìm kiếm theo tên/SĐT/nội dung/dự án, Kênh tiếp nhận, Cảm xúc AI, Số sao 1-5, Trạng thái xử lý khiếu nại); Thẻ nhận xét chi tiết với hộp quote trích dẫn, huy hiệu cảm xúc, điểm NPS/CES, nút Phản Hồi Nhanh qua Zalo/SMS, và nút Xử Lý Khiếu Nại (SLA 24h) cho đánh giá tiêu cực.
    - **Tab 3: Chiến Dịch Tự Động Hóa Khảo Sát**: 5 Chiến dịch kích hoạt tự động theo kịch bản hành vi (Sau check-in sa bàn 1h, Sau khi ký cọc, Sau giải ngân đợt 1, Khi bàn giao căn hộ, Định kỳ 6 tháng cư dân); Thẻ chiến dịch có công tắc Bật/Tắt tự động, tỷ lệ phản hồi, điểm thưởng Loyalty trao tặng, nút Copy Link và nút Xem Báo Cáo.
    - **Tab 4: Trình Tạo & Xem Trước Form Khảo Sát Mobile**: Khung mô phỏng Smartphone iPhone cao cấp tương tác trực tiếp (UX/UI responsive, bàn phím chọn điểm NPS 0-10, chấm sao CSAT 1-5 có hiệu ứng hover, thang điểm nỗ lực CES 1-7, form nhập ý kiến đóng góp tích hợp gửi trực tiếp vào Zustand Store); Bảng cấu hình tùy biến câu hỏi, dự án và cơ chế webhook tự động bên cạnh.
  - [x] 5 Modal tương tác không có nút chết:
    - Modal 1: Giả lập đánh giá khách hàng trực tiếp (`showSimModal`, nhập đánh giá và lập tức tính toán lại toàn bộ chỉ số CSAT/NPS ngoài dashboard).
    - Modal 2: Tạo chiến dịch khảo sát tự động mới (`showCreateCampaignModal`, cấu hình tên, kênh gửi, trigger logic, đối tượng và điểm thưởng).
    - Modal 3: Xử lý khiếu nại Red Alert SLA 24h (`selectedComplaint`, phân bổ chuyên viên phụ trách và nhập phương án khắc phục sự cố).
    - Modal 4: Báo cáo hiệu quả chiến dịch khảo sát chi tiết (`selectedCampaignReport`, conversion rate, CSAT, NPS và link công khai).
    - Modal 5: QR Code Standee Showroom Kiosk (`showQrModal`, hiển thị mã QR vector đặt tại quầy lễ tân sa bàn kèm nút Copy Link và Tải File In A5).
  - [x] Nút Xuất Báo Cáo CSV (`handleExportCSV`): Tải trực tiếp báo cáo toàn bộ đánh giá, phân loại cảm xúc và trạng thái xử lý chuẩn UTF-8 BOM.

---

## GIAI ĐOẠN 5: TÀI CHÍNH, VẬN HÀNH & NỀN TẢNG HỆ THỐNG

### 23. Báo Cáo Phân Tích Thông Minh BI (`/bi`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Zustand Store & AI ARIMA Engine).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/bi.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/bi.md)
- **Mục tiêu**: Khoang lái điều hành doanh nghiệp đa chiều (Executive Analytics Cockpit), phân tích phễu chuyển đổi toàn trình 6 giai đoạn, dòng tiền thực thu vs kế hoạch, ma trận hấp thụ giỏ hàng theo dự án, mô hình AI ARIMA dự báo doanh thu 12 tháng và bản đồ nhiệt tương tác (Heatmap) tìm khung giờ vàng.
- **Mock Data**: Số liệu thực tế từ hệ thống hợp đồng HĐMB, dữ liệu phễu 1,850 leads -> 98 deals, ma trận dòng tiền 6 tháng, ma trận hấp thụ 3 đại dự án (The Grand Manhattan, Aqua City, The Global City), và bản đồ nhiệt 7x7 khung giờ (biHeatmapData).
- **Thành phần UI/UX**:
  - [x] Header điều hành tích hợp bộ lọc dự án nhanh, chu kỳ thời gian (Tháng 7, Quý 3, 6 tháng, Cả năm), và 4 thẻ KPI chiến lược: Tổng Doanh Số HĐMB (128.5 Tỷ, +14.8%), Dòng Tiền Đã Thực Thu (78.2 Tỷ, 60.8%), Chuyển Đổi Toàn Phễu (5.3%, 14.2 ngày/deal), Tỷ Lệ Hấp Thụ Giỏ Hàng (78.5%, cháy hàng trong 4.5 tháng).
  - [x] AI Insights Executive Banner: Card phân tích dữ liệu điều hành C-Level với 3 cảnh báo chuyên sâu: Dự báo tăng trưởng Q3 (đạt đỉnh 5,800 Tỷ VNĐ vào T8/2026), Cảnh báo nút thắt phễu (rớt 46.5% tại chặng sa bàn), và Tối ưu hóa dòng tiền thu đợt (25% khách thanh toán sớm 70%).
  - [x] 4 Tabs tác nghiệp toàn diện:
    - **Tab 1: Tổng Quan & Dự Báo ARIMA**: Biểu đồ Recharts LineChart 12 tháng kết hợp số liệu thực tế (Actual) và mô hình AI ARIMA (Forecast); Biểu đồ cơ cấu doanh thu theo dự án; Cơ cấu 3 phương thức thanh toán khách lựa chọn (Vay ưu đãi 0%, Tiến độ chuẩn, Thanh toán sớm 70%).
    - **Tab 2: Phễu Bán Hàng & Nút Thắt**: Phễu chuyển đổi BĐS 6 nấc thang trực quan (Inbound Leads 1,850 ➔ Tương tác sâu 1,120 ➔ Xem Sa bàn 640 ➔ Đặt Booking 280 ➔ Chốt Cọc 145 ➔ Ký HĐMB 98); Tỷ lệ rơi rụng ở từng chặng; 3 Thẻ mổ xẻ nguyên nhân nút thắt (tiến độ hạ tầng, thủ tục ngân hàng, vận tốc phản hồi 15 phút).
    - **Tab 3: Dòng Tiền & Tồn Kho Dự Án**: Biểu đồ BarChart so sánh kế hoạch thu tiền vs dòng tiền thực thu; Công nợ phải thu tồn đọng (8.4 Tỷ); Ma trận hấp thụ giỏ hàng 3 đại dự án kèm thanh tiến độ % và dự báo ngày hết hàng; Cảnh báo hàng ế ẩm > 90 ngày.
    - **Tab 4: Bản Đồ Nhiệt Tương Tác**: Ma trận nhiệt 7 ngày x 7 khung giờ (`08:00` đến `20:00`) tương tác trực tiếp; Bảng màu phân cấp độ nóng; Nút "Làm Mới Heatmap" mô phỏng dữ liệu; Cẩm nang 3 khung giờ vàng (Telesale, Đón khách Showroom, Chạy Ads chuyển đổi).
  - [x] 5 Modal tương tác không có nút chết:
    - Modal 1: Bộ lọc phân tích đa chiều nâng cao (`showFilterModal`, lọc theo Dự án, Chu kỳ thời gian, Phân khúc).
    - Modal 2: Trình mô phỏng kịch bản tăng trưởng What-If (`showWhatIfModal`, 3 thanh trượt Ngân sách Marketing, Chiết khấu mở bán, Tuyển thêm Sales với kết quả dự phóng doanh thu & deals thời gian thực).
    - Modal 3: Kế hoạch tháo gỡ nút thắt phễu bán hàng (`showBottleneckModal`, 3 biện pháp cấp bách).
    - Modal 4: Lịch trình dòng tiền & thu hồi công nợ (`showCashflowDetailModal`, bảng chi tiết các đợt thanh toán đến hạn).
    - Modal 5: Chi tiết ô nhiệt Heatmap (`selectedHeatmapCell`, xem cơ cấu cuộc gọi, tin nhắn Zalo, khách ghé showroom của khung giờ được click).
  - [x] Nút Xuất Báo Cáo CSV (`handleExportCSV`): Tải trực tiếp toàn bộ dữ liệu báo cáo điều hành BI chuẩn UTF-8 BOM.

---

### 24. Tổng Đài Ảo VoIP Cloud (`/call-center`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Zustand Store & Web Audio DTMF Softphone).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/call-center.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/call-center.md)
- **Mục tiêu**: Hệ thống Softphone VoIP WebRTC gọi điện trực tiếp trên trình duyệt, phát âm thanh bấm số DTMF bằng Web Audio API, hiển thị trạng thái đàm thoại sống (Live Call Timer, Mute, Hold, Transfer, End Call), bóc băng tự động Speech-to-Text AI, phân loại cảm xúc NLP Sentiment, chấm điểm kiểm tra chất lượng cuộc gọi (QA Audit Scorecard) và cẩm nang xử lý từ chối telesale thời gian thực.
- **Mock Data**: 8 Cuộc gọi thực tế đa dạng kịch bản (The Grand Manhattan, Aqua City, The Global City, Novaworld Phan Thiết, Eco Green Saigon, Vinhomes Grand Park), 8 bản ghi bóc băng chi tiết từng câu thoại, và số liệu đàm thoại (Agent Talk Ratio 45%, Speech Rate 120 từ/phút).
- **Thành phần UI/UX**:
  - [x] Header điều hành tích hợp huy hiệu trạng thái máy lẻ `Extension: 101 - Tuấn Tú (Online/Available)`, và 4 thẻ KPI chiến lược: Tổng Cuộc Gọi Hôm Nay (8 Cuộc, 7 kết nối thành công), Thời Lượng Gọi TB AHT (07:25 phút), Tỷ Lệ Bắt Máy Connect Rate (88%), Điểm Cảm Xúc Tích Cực AI (63%).
  - [x] 4 Tabs tác nghiệp toàn diện:
    - **Tab 1: Bàn Phím & Cuộc Gọi Trực Tiếp**: Bàn phím số Softphone 3x4 có âm thanh DTMF chuẩn ITU-T; Màn hình LED nhận diện số và tự động khớp tên khách hàng trong CRM; Trạng thái cuộc gọi sống có đồng hồ đếm giây (`00:01`, `00:02`...), nút Tắt Mic, Tạm Giữ, Chuyển Cuộc Gọi và Gác Máy màu đỏ; Cột bên phải là Trình phát ghi âm cao cấp có waveform mô phỏng, biểu đồ Donut phân tích cảm xúc 3 cấp (Tích cực, Trung tính, Tiêu cực), tab Key Takeaways và tab Bóc Băng Từng Câu Thoại.
    - **Tab 2: Nhật Ký & Bóc Băng Hội Thoại**: Bộ lọc 4 chiều (Tìm kiếm theo tên/SĐT/dự án/ghi chú, Lọc cảm xúc, Lọc trạng thái thành công/nhỡ, Lọc kết quả cuộc gọi); Bảng dữ liệu chi tiết có điểm QA, thời lượng, kết quả disposition và nút "Chi tiết & Bóc băng".
    - **Tab 3: Chấm Điểm QA & Kỹ Năng Sale**: Bảng điểm 100 điểm với 5 tiêu chí nghiệp vụ (Chào hỏi nhận diện 20đ, Lắng nghe & Talk Ratio 20đ, Kiến thức sản phẩm & ngân hàng 20đ, Kêu gọi hành động CTA 20đ, Thái độ khi bị từ chối 20đ); Xếp loại Hạng A (91/100); 3 Lời khuyên huấn luyện kỹ năng (Coaching Tips).
    - **Tab 4: Kịch Bản Xử Lý Từ Chối**: 4 Tình huống kinh điển BĐS cao cấp (Khách chê giá cao, Khách e ngại đường xa, Khách báo bận họp, Khách lo ngại lãi suất thả nổi); Lời thoại mẫu của chuyên viên và nút 1-click Copy Mẫu Tin Nhắn Zalo.
  - [x] 5 Modal tương tác không có nút chết:
    - Modal 1: Chuyển cuộc gọi nội bộ (`showTransferModal`, chuyển tiếp cuộc gọi sang máy lẻ Lê Hoàng Anh Ext 103, Thanh Hà Ext 102, Bảo Trần Ext 104 kèm ghi chú).
    - Modal 2: Phân loại kết quả cuộc gọi (`showDispositionModal`, chọn kết quả Hẹn xem sa bàn, Khách quan tâm, Gọi lại sau, Chốt cọc... và lưu ghi chú vào CRM).
    - Modal 3: Cẩm nang xử lý từ chối nhanh (`showScriptModal`, mẹo đàm phán tức thì trong lúc gọi).
    - Modal 4: Bảng điểm kiểm tra chất lượng QA (`showQAModal`, xem chi tiết điểm số từng tiêu chí).
    - Modal 5: Tạo nhanh hồ sơ khách hàng mới (`showNewContactModal`, lưu khách hàng trực tiếp từ số điện thoại vừa quay).
  - [x] Nút Xuất Báo Cáo CSV (`handleExportCSV`): Tải trực tiếp nhật ký cuộc gọi và phân tích cảm xúc chuẩn UTF-8 BOM.

---

### 25. Kênh Trò Chuyện Nội Bộ & Khách Hàng Zalo OA (`/chat`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Zustand Store & Omnichannel Zalo OA).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/chat.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/chat.md)
- **Mục tiêu**: Trung tâm điều hành liên lạc tức thì (Unified Communications Cockpit) cho sàn bất động sản cao cấp, kết nối đa kênh giữa các phòng ban dự án nội bộ, trao đổi trực tiếp đồng nghiệp và nhận tin nhắn từ Zalo Official Account khách hàng VIP.
- **Mock Data**: 5 Kênh nhóm dự án (#dự-án-aqua-city, #team-sale-quận-1, #ban-giám-đốc, #hỗ-trợ-pháp-lý, #chiến-dịch-novaworld), 5 luồng DM đồng nghiệp, 4 khách hàng Zalo OA & LiveChat với hồ sơ 360°, Điểm Nhiệt AI và các thẻ bất động sản sang trọng.
- **Thành phần UI/UX**:
  - [x] Header điều hành tích hợp bộ chuyển đổi trạng thái (🟢 Trực tuyến, 🟡 Bận tiếp khách, ⚪ Ngoại tuyến) và 4 thẻ KPI chiến lược: Tin Nhắn Chưa Đọc (8 tin), Tốc Độ Phản Hồi TB FRT (1.8 Phút - SLA &lt; 3p), Khách Đang Chat Zalo OA (14 Khách, 4 VIP Diamond), Tỷ Lệ Giải Quyết Đầu Tiên FCR (89.2%).
  - [x] Cột điều hướng đa luồng (Left Sidebar): Ô tìm kiếm tức thì theo tên/SĐT/mã căn, bộ lọc 4 danh mục (Tất cả, # Kênh, Zalo OA, Đồng nghiệp), huy hiệu đếm tin chưa đọc và chỉ báo online.
  - [x] Khung chat trung tâm (Center Chat Area): Bong bóng tin nhắn phong phú (Text, Thẻ BĐS Listing Card với ảnh, giá, diện tích, hoa hồng, nút Giữ Chỗ Căn Này, Tệp đính kèm PDF báo giá, Thông báo sự kiện hệ thống bot Zalo OA); Dãy chip gợi ý phản hồi nhanh 1-chạm (Gửi bảng giá 14%, Hẹn xem sa bàn thứ 7, Gửi STK CĐT Novaland).
  - [x] Thanh soạn thảo thông minh: Tự co giãn theo nội dung, phím tắt Enter/Shift+Enter, nút đính kèm căn hộ từ giỏ hàng, nút chèn mẫu kịch bản CSKH, tải lên tệp tài liệu, gửi tin nhắn thoại (Voice note) và emoji BĐS.
  - [x] Bảng thông tin tác nghiệp chuyên sâu (Right Inspector Panel):
    - Khi chọn Kênh: Xem chủ đề, thông báo đã ghim, danh sách 24 thành viên trực tuyến/ngoại tuyến kèm chức danh, kho tài liệu chia sẻ.
    - Khi chọn Khách Zalo OA: Hồ sơ CRM 360° thu nhỏ (Lead Score 96/100, dự án quan tâm, tầm tài chính, phân công chuyên viên), tác vụ nhanh CRM và công tắc bật/tắt Trợ lý AI tự động trả lời ngoài giờ.
  - [x] 6 Modal tương tác không có nút chết:
    - Modal 1: Khởi tạo kênh thảo luận mới (`showCreateChannelModal`, phân loại dự án/phòng ban/BOD, chủ đề, mô tả).
    - Modal 2: Đính kèm căn hộ/sản phẩm BĐS vào khung chat (`showAttachListingModal`, tìm kiếm mã căn và chèn Listing Card tức thì).
    - Modal 3: Thư viện mẫu tin nhắn nhanh CSKH (`showQuickTemplatesModal`, 6 mẫu câu chuẩn môi giới BĐS cao cấp).
    - Modal 4: Chuyển tiếp tin nhắn thành Task CRM (`showForwardTaskModal`, gán chuyên viên, ưu tiên, hạn chót).
    - Modal 5: Hồ sơ khách hàng Zalo OA 360° đầy đủ (`showCustomerDrawer`, phễu bán hàng, ghi chú đàm phán).
    - Modal 6: Hội nghị trực tuyến Video Call P2P Fullscreen (`showVideoCall`, bật/tắt mic, camera, chia sẻ màn hình sa bàn VR).
  - [x] Nút Xuất Báo Cáo CSV (`handleExportCSV`): Tải trực tiếp toàn bộ dữ liệu lịch sử hội thoại chuẩn UTF-8 BOM.

---

### 26. Đua Top Doanh Số & Gamification Chiến Binh BĐS (`/gamification`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Zustand Store & Sales Arena).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/gamification.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/gamification.md)
- **Mục tiêu**: Đấu trường đua top doanh số BĐS cao cấp áp dụng lý thuyết Octalysis Gamification, biến hành vi tác nghiệp hằng ngày (telesale, dẫn khách sa bàn, gửi báo giá) thành điểm EXP, thăng cấp bậc chiến binh, vinh danh bục vàng hoàng gia và đổi thưởng hiện vật giá trị lớn.
- **Mock Data**: Bảng xếp hạng Top 10 chiến binh (Nguyễn Trần Tuấn Tú 25.5 Tỷ, Lê Hoàng Anh 21.0 Tỷ, Phạm Thị Mai 18.5 Tỷ...), 5 nhiệm vụ tác nghiệp tuần & săn Boss toàn sàn, 8 huy hiệu danh giá theo 4 cấp độ hiếm (Phổ biến, Hiếm, Sử thi, Huyền thoại) và 6 phần thưởng hiện vật (Hot Leads VIP, Voucher Centara Mirage, iPad Pro M4, Thưởng nóng 10tr, Thẻ Golf PGA, Du lịch Thụy Sĩ).
- **Thành phần UI/UX**:
  - [x] Header điều hành tích hợp bộ chọn chu kỳ 4 mốc (Tháng này, Tuần này, Quý 3/2026, Cả năm), nút Điểm danh hàng ngày (+200 EXP kèm hiệu ứng toast), nút Đổi quà thưởng và nút Xuất Bảng Vàng CSV.
  - [x] 4 Thẻ KPI chiến lược: Doanh Số Đua Top (148.5 Tỷ, +24.5%), Quỹ Thưởng & Hiện Vật (1.25 Tỷ VNĐ), Chiến Binh Đạt Chuẩn MVP (18 / 65 Chiến binh), EXP Tích Lũy Toàn Sàn (1,420,500 EXP - Tier Vàng).
  - [x] Player Profile Hero Card (Thẻ Nhân Vật Chiến Binh): Avatar hào quang hoàng kim, cấp độ Level 28, danh hiệu Chiến Thần Chốt Cọc, chuỗi streak 5 tuần liên tục cọc 🔥, thanh tiến độ thăng cấp Level 29 (Thống Đốc Địa Ốc Q1) với 98,500 / 105,000 EXP.
  - [x] Bục Vinh Danh Top 3 Grand Podium: Bục Vàng Quán Quân (Nguyễn Trần Tuấn Tú 25.5 Tỷ, Cúp Vàng 👑, Du lịch Thụy Sĩ + 100tr), Bục Bạc Á Quân (Lê Hoàng Anh 21.0 Tỷ, Cúp Bạc 🥈, Du lịch Nhật Bản + 50tr), Bục Đồng Hạng Ba (Phạm Thị Mai 18.5 Tỷ, Cúp Đồng 🥉, iPhone 16 Pro Max + 30tr) kèm nút Tôn vinh MVP & Gửi lời chúc mừng 👏.
  - [x] 4 Tabs thi đua toàn diện:
    - Tab 1: Bảng Xếp Hạng Chi Tiết (Leaderboard Top 10+) với bộ lọc theo sàn giao dịch, tìm kiếm tức thì, số deals, doanh số, EXP, danh hiệu và nút Thách Đấu PK 1-1.
    - Tab 2: Thử Thách Tuần & Săn Boss (Quests & Boss Raids) với 5 nhiệm vụ có thanh progress %, nút nhận thưởng EXP và banner Boss Raid Aqua City (7/10 căn, mở rương 50 triệu teambuilding).
    - Tab 3: Tủ Kính Huy Hiệu Danh Giá (Badges) phân loại theo 4 cấp độ hiếm, hiển thị ngày mở khóa và lượng EXP thưởng danh dự.
    - Tab 4: Cửa Hàng Đổi Quà Thưởng (Reward Store) quy đổi EXP lấy 6 hiện vật giá trị cao có kiểm tra số dư và trừ điểm tự động.
  - [x] 5 Modal tương tác không có nút chết:
    - Modal 1: Thách đấu PK 1-1 doanh số (`showChallengeModal`, chọn đối thủ, mục tiêu đua, mức cược 200 - 2,000 EXP, lời nhắn).
    - Modal 2: Xác nhận đổi quà thưởng (`showRewardStoreModal`, kiểm tra số dư EXP, trừ điểm qua `redeemReward`).
    - Modal 3: Chi tiết chiến tích cá nhân (`selectedAgentForDetail`, xem lịch sử deal, chuỗi streak, danh hiệu).
    - Modal 4: Gửi lời chúc mừng & tặng EXP tình thân (`showKudosModal`, tặng +100 EXP qua `sendKudos`).
    - Modal 5: Thể lệ chiến dịch săn Boss doanh số toàn sàn (`showBossRaidModal`, xem cơ cấu giải thưởng 50 triệu).
  - [x] Nút Xuất Báo Cáo CSV (`handleExportCSV`): Tải trực tiếp toàn bộ dữ liệu bảng vàng doanh số chuẩn UTF-8 BOM.

---

### 27. Bảng Tính Lãi Vay & Dòng Tiền Đầu Tư BĐS (`/mortgage`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Zustand Store & Mortgage Engine).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/mortgage.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/mortgage.md)
- **Mục tiêu**: Bảng tính đòn bẩy tài chính và lịch khấu hao 360 tháng, áp dụng gói hỗ trợ 0% lãi suất và ân hạn nợ gốc của CĐT, đánh giá DTI, dòng tiền cho thuê ròng (Rental Yield) và mô phỏng phí phạt tất toán nợ trước hạn.
- **Mock Data**: 4 Ngân hàng đối tác chiến lược (MBBank, VPBank, Techcombank, Vietcombank), liên kết trực tiếp rổ hàng tồn kho mở bán realtime (`availableInventory`), 3 hồ sơ vay đã lưu (`savedMortgageSimulations`) và danh bạ khách hàng VIP.
- **Thành phần UI/UX**:
  - [x] Header điều hành tích hợp 4 nút hành động: So Sánh 4 Ngân Hàng, Trả Nợ Trước Hạn, Tư Vấn Zalo VIP, và Lưu / Xuất Báo Cáo.
  - [x] 4 Thẻ KPI vĩ mô: Gói Vay Ưu Đãi CĐT (0% Lãi suất & Ân hạn 24 tháng), Tỷ Suất Cho Thuê Ròng (2.55% - 4.2%/năm), Tổng Sinh Lời Hàng Năm (+17.5% - +22%/năm), Thời Gian Hoàn Vốn Tích Sản (5.7 - 6.2 năm).
  - [x] Cột Tham Số Vay Vốn & Ngân Hàng (Left Column):
    - Thẻ liên kết rổ hàng tồn kho: Dropdown chọn trực tiếp căn hộ mở bán để tự động đồng bộ giá niêm yết (VD: AQC-PH-102 14.5 Tỷ, TGM-15.01 18.5 Tỷ...).
    - Bộ chuyển đổi 2 phương thức trả nợ: Dư Nợ Giảm Dần vs Niên Kim Cố Định (Linear PMT) với tính toán tức thì.
    - Thanh trượt giá trị BĐS (3 - 50 Tỷ), tỷ lệ vay (50%, 70%, 75%, 80%), thời hạn vay (5 - 30 năm), thu nhập ròng để tính DTI.
    - Công tắc chính sách 0% Lãi suất & Ân hạn nợ gốc theo từng ngân hàng đối tác.
    - Danh sách 4 ngân hàng đối tác với logo thương hiệu, lãi suất ưu đãi, lãi suất thả nổi và cam kết phê duyệt.
  - [x] Cột Phân Tích & Dự Phóng Tài Chính (Right Column):
    - 4 Thẻ kiểm tra sức bền tài chính: Vốn tự có cần chuẩn bị (30%), Số tiền trả tháng cao nhất sau ân hạn, Tổng tiền lãi suốt chu kỳ, Chỉ số an toàn DTI (<40%).
    - 3 Tabs phân tích chuyên sâu:
      - Tab 1: Lịch Trả Nợ & Biểu Đồ Dư Nợ với AreaChart Recharts mô phỏng dư nợ giảm dần qua từng năm, Bảng 12 tháng đầu tiên, nút xem toàn bộ 360 tháng và nút xuất CSV.
      - Tab 2: Hiệu Quả Đầu Tư & Cho Thuê với thanh trượt giá thuê tháng, tăng giá vốn hàng năm, tính toán Rental Yield và đánh giá đòn bẩy AI.
      - Tab 3: Danh Sách Phương Án Đã Lưu với danh sách các kịch bản của khách hàng, nút áp dụng lại toàn bộ thông số vào bảng tính và nút xóa.
  - [x] 5 Modal tương tác không có nút chết:
    - Modal 1: Bảng khấu hao toàn bộ chu kỳ 360 tháng (`showFullAmortizationModal`) có bộ lọc xem theo năm và nút tải CSV trực tiếp.
    - Modal 2: Ma trận so sánh chuyên sâu 4 ngân hàng đối tác (`showBankCompareModal`) với 8 tiêu chuẩn đối chiếu và nút "Chọn Gói Này" áp dụng tức thì.
    - Modal 3: Mô phỏng trả nợ trước hạn & phí phạt (`showPrepaymentModal`) tính toán chính xác dư nợ gốc, phí phạt và số tiền lãi tiết kiệm được hàng trăm triệu.
    - Modal 4: Lưu & xuất báo cáo kế hoạch tài chính PDF (`exportModalOpen`) gắn với khách hàng trong CRM và ghi chú chiến lược.
    - Modal 5: Gửi phương án qua Zalo VIP 1-chạm (`shareModalOpen`) với 3 phong cách tư vấn (Tóm tắt nhanh, Dòng tiền bù lãi, Phân tích ROI), sao chép clipboard và mở Zalo Web.
  - [x] Nút Xuất Báo Cáo CSV (`handleExportCSV`): Tải trực tiếp toàn bộ dữ liệu bảng khấu hao chuẩn UTF-8 BOM.

---

## GIAI ĐOẠN 6: QUẢN TRỊ GIA SẢN, TÀI LIỆU PHÁP LÝ & MỞ RỘNG HỆ THỐNG

### 28. Quản Lý Gia Sản & Danh Mục Đầu Tư BĐS VIP (`/portfolio`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Zustand Store & Wealth Management Engine).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/portfolio.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/portfolio.md)
- **Mục tiêu**: Sổ tay tài sản số hóa toàn diện (Digital Real Estate Vault) dành riêng cho nhà đầu tư VIP & VVIP: Theo dõi định giá thị trường độc lập, tính toán IRR & CAGR, theo dõi lịch thanh toán đợt tới kèm VietQR 1-chạm, mô phỏng chốt lời thoát hàng (Exit Simulator) và hỗ trợ AI tái cơ cấu danh mục tài sản tối ưu.
- **Mock Data**: 6 Bất động sản hạng sang đa dạng loại hình (Biệt thự biển NovaWorld, Nhà phố Phượng Hoàng Aqua City, Sky Villa The Grand Manhattan, Nhà phố Soho The Global City, Căn hộ The Beverly Vinhomes Grand Park) thuộc quyền sở hữu của các nhà đầu tư VVIP (Nguyễn Văn Tuấn, Phạm Minh Tuấn, Trần Thị Bích Ngọc, Vũ Thu Trang).
- **Thành phần UI/UX**:
  - [x] Header điều hành Private Banking Tier tích hợp 3 nút hành động: Mô Phỏng Chốt Lời, Báo Cáo Gia Sản VIP, và Thêm Bất Động Sản.
  - [x] Thanh lọc danh mục theo Nhà Đầu Tư VIP: Dropdown chuyển đổi mượt mà giữa Toàn bộ nhà đầu tư VIP và từng khách hàng cụ thể (Nguyễn Văn Tuấn 37.5 Tỷ, Phạm Minh Tuấn 67.0 Tỷ, Trần Thị Bích Ngọc 5.5 Tỷ...), ô tìm kiếm tức thì và nút Xuất CSV.
  - [x] 4 Thẻ KPI gia sản vĩ mô:
    - Tổng Vốn Đầu Tư Gốc (129.5 Tỷ VNĐ)
    - Định Giá Thị Trường Hiện Tại (159.8 Tỷ VNĐ, Lãi vốn +23.4% / +30.3 Tỷ VNĐ)
    - Dòng Tiền Thuê Ròng/Năm (4.19 Tỷ VNĐ/năm, Rental Yield 3.23%/năm)
    - Tỷ Suất Sinh Lời Toàn Danh Mục (+21.8%/Năm Weighted IRR)
  - [x] 4 Tabs tác nghiệp toàn diện:
    - **Tab 1: Tổng Quan Danh Mục & Tăng Trưởng Tài Sản**: Biểu đồ AreaChart Recharts so sánh Vốn đầu tư vs Định giá thị trường qua các năm (2021-2026); Biểu đồ PieChart phân bổ loại hình BĐS; Biểu đồ BarChart dòng tiền thuê ròng theo từng quý; Thẻ AI Diagnostic chấm điểm sức khỏe gia sản 93/100 (Tối ưu).
    - **Tab 2: Sổ Tay Bất Động Sản Sở Hữu (Digital Asset Cards)**: Lưới danh thiếp số hóa cho từng căn hộ với ảnh sắc nét, badge tình trạng (Đã có sổ hồng, Đang xây thô 75%, Đã cất nóc 90%), so sánh giá mua vs định giá hiện tại, thanh tiến độ xây dựng %, tình trạng cho thuê và khuyến nghị AI (Tiếp tục giữ / Chốt lời / Tối ưu giá thuê).
    - **Tab 3: Lịch Đóng Tiền Đợt Kế Tiếp**: Danh sách các đợt thanh toán đến hạn theo tiến độ HĐMB, tỷ lệ %, số tiền cụ thể, hạn nộp và nút "Thanh Toán / Lấy VietQR".
    - **Tab 4: Chiến Lược Tái Cơ Cấu & Thoát Hàng AI**: 2 Kịch bản AI khuyến nghị hành động (Chốt lời đỉnh sóng căn Sky Villa Manhattan thu về +8.5 Tỷ lợi nhuận ròng để gom 2 căn Shophouse The Global City; Tái đàm phán hợp đồng thuê biệt thự biển NovaWorld sang mô hình Luxury Airbnb tăng dòng tiền lên 90Tr/tháng).
  - [x] 5 Modal tương tác không có nút chết:
    - Modal 1: Chi tiết thẻ căn hộ & pháp lý số hóa (`selectedPropertyForDetail`, xem bản vẽ, HĐMB công chứng, biên bản nghiệm thu kỹ thuật).
    - Modal 2: Thông báo đóng tiền & VietQR 1-chạm (`selectedMilestoneForPayment`, hiển thị mã VietQR NAPAS 247, số TK CĐT, cú pháp chuẩn và nút xác nhận đã chuyển khoản cập nhật trạng thái `paid`).
    - Modal 3: Mô phỏng chốt lời & thoát hàng BĐS (`showExitModal`, thanh trượt giá bán, tự động trừ thuế TNCN 2%, phí môi giới 1.5%, tính Net Profit và Net ROI).
    - Modal 4: Thêm bất động sản vào danh mục VIP (`showAddPropertyModal`, form chọn khách hàng, dự án, mã căn, giá mua, định giá, diện tích, giá thuê).
    - Modal 5: Báo cáo thẩm định gia sản khách hàng VIP PDF (`showWealthReportModal`, bản xem trước tài liệu Private Wealth và nút tải PDF có dấu mộc).
  - [x] Nút Xuất Báo Cáo CSV (`handleExportCSV`): Tải trực tiếp toàn bộ dữ liệu sổ tay gia sản khách hàng VIP chuẩn UTF-8 BOM.


---

### 29. Kho Tài Liệu Pháp Lý & Biểu Mẫu (`/documents`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Zustand Store & Legal Vault).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/documents.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/documents.md)
- **Mục tiêu**: Thư viện lưu trữ số hóa hồ sơ pháp lý bất động sản (quy hoạch 1/500, giấy phép xây dựng, nghiệm thu móng cọc, chứng thư bảo lãnh ngân hàng), bản vẽ kỹ thuật CAD, phim TVC 4K, thực tế ảo VR 360 và mẫu HĐMB chuẩn CĐT phục vụ tư vấn bán hàng đa kênh.
- **Mock Data**: 6 Thư mục dự án trọng điểm (`folder1` đến `folder6`), 15+ tài liệu số hóa đa định dạng (PDF, CAD DWG, TVC 4K MP4, VR 360, DOCX) với phân loại nhãn, cơ quan ký duyệt, tình trạng hiệu lực và số lượt tải.
- **Thành phần UI/UX**:
  - [x] Header điều hành với 4 thẻ KPI vĩ mô: Tổng số hồ sơ số hóa (15+ tài liệu), Pháp lý hiệu lực thi hành (100%), Tổng lượt tải Sales Kit (3.250+ lượt), Dung lượng đã số hóa (1.25 GB).
  - [x] Thanh công cụ ngoại tuyến (Offline Sales Kit Synchronization): Tiến độ bộ nhớ đệm thời gian thực (65% -> 100%) kèm nút "Đồng bộ ngay" kích hoạt nạp cache mượt mà.
  - [x] Cây thư mục dự án bên trái: 6 dự án phân loại với số file con hiển thị động theo thời gian thực (The Grand Manhattan, Aqua City, NovaWorld Phan Thiết, The Global City, Eco Green Saigon, Vinhomes Grand Park).
  - [x] Bộ lọc định dạng file theo chip (All, PDF Pháp lý, CAD .DWG, TVC 4K, VR 360 / 3D, Mẫu DOCX), ô tìm kiếm tức thì và nút chuyển đổi Grid View / List View.
  - [x] 5 Modal tương tác không có nút chết:
    - Modal 1: Trình xem văn bản trực tiếp & Dấu mộc đỏ pháp chế (`selectedDocForPreview`, khổ A4, Quốc hiệu, trích yếu, chữ ký số).
    - Modal 2: Chia sẻ Sales Kit đa kênh & Quét mã QR Zalo (`selectedDocForShare`, kịch bản tư vấn chuẩn mực, link tải token bảo mật, mã QR scan bằng camera/Zalo mobile).
    - Modal 3: Tải lên & ban hành văn bản mới (`showUploadModal`, chọn thư mục, định dạng, tình trạng hiệu lực, cơ quan ký, lưu trực tiếp vào Zustand `addDocumentFile`).
    - Modal 4: Lịch sử phiên bản & nhật ký kiểm toán (`selectedDocForAudit`, timeline v2.4 vs v1.0, cơ quan ký, ngày ban hành).
    - Modal 5: Tải xuất trọn bộ Sales Kit file ZIP (`showBatchDownloadModal`, đóng gói tài liệu nén ước tính 85.4 MB).
  - [x] Nút Xuất Báo Cáo CSV (`handleExportCSV`): Tải trực tiếp toàn bộ dữ liệu kho tài liệu pháp lý chuẩn UTF-8 BOM.


---

### 30. Trạm Di Động PWA Đi Thị Trường (`/mobile`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Zustand Store & PWA Field Hub).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/mobile.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/mobile.md)
- **Mục tiêu**: Ứng dụng di động PWA dành cho chuyên viên kinh doanh đi thực địa dẫn khách tại các đại công trường (Aqua City, NovaWorld Phan Thiết...), sa bàn và sự kiện mở bán; hoạt động hoàn hảo khi mất mạng (Offline-first), tích hợp ký hợp đồng cọc điện tử, GPS Check-in, quét căn cước eKYC, khóa căn khẩn cấp và trung tâm bắn thông báo đẩy broadcast.
- **Mock Data**: 142 thiết bị PWA kích hoạt, hàng đợi `syncQueue` lưu tạm IndexedDB, 3 thông báo broadcast `mobileNotifications`, giỏ hàng `inventory` kết nối realtime và danh sách 5 chuyên viên thực địa.
- **Thành phần UI/UX**:
  - [x] Header điều hành tích hợp 4 thẻ KPI vĩ mô: Thiết Bị Kích Hoạt (142 Máy), Hàng Đợi Chờ Gửi (Sync Queue), Tỷ Lệ Đồng Bộ (99.8%), Thông Báo Đẩy Broadcast.
  - [x] Giả lập iPhone 16 Pro Max siêu thực tế: Khung viền Titanium, Dynamic Island tương tác, nút vật lý bấm có phản hồi toast, banner iOS trượt thả, thanh trạng thái iOS 18 (đồng hồ, pin 98%, vạch 5G/Mất sóng).
  - [x] 4 Tab ứng dụng thực địa trên di động:
    - **Tab 1: Rổ Hàng Nhanh**: Tra cứu giỏ hàng tồn kho từ `inventory`, bộ lọc theo dự án, tìm kiếm tức thì và nút "⚡ Khóa 15p" giữ chỗ khẩn cấp.
    - **Tab 2: E-Signature Ký HĐ Cọc**: Canvas cảm ứng mượt mà, bộ 3 màu mực (Xanh CĐT, Đen chuẩn, Đỏ niêm phong), nút Xóa lại, nút Ký & Gửi/Lưu Offline và nút Xem bản HĐ A4 hoàn chỉnh.
    - **Tab 3: Công Cụ Thực Địa**: GPS Check-in (tọa độ vĩ độ 10.8231 N, kinh độ 106.6297 E, bán kính Geofence 12m), nút bật camera quét CCCD eKYC, và máy ghi âm đàm phán thoại (Voice memo có timer nhảy giây thời gian thực).
    - **Tab 4: Bản Tin & Thông Báo**: Danh sách thông báo đẩy từ sàn, nút Thử Chuông Web Audio native, chạm vào để đánh dấu đã đọc.
  - [x] Bảng điều khiển trung tâm chỉ huy sàn (Manager Command Center):
    - **Bộ điều khiển mạng ngoại tuyến**: Công tắc bật/tắt Offline-first, danh sách Sync Queue với nút "Đẩy Lên Server" và "Xóa Hết".
    - **Trung tâm bắn thông báo đẩy**: Form soạn thông báo, 3 mẫu sự kiện nhanh (Bung hàng gấp, Thưởng nóng 50Tr, Lịch xe đưa đón), chọn nhóm nhận tin và nút bắn phát chuông Ting-ting Web Audio.
    - **Giám sát đội ngũ thực địa**: Bảng 5 chuyên viên ngoài công trường, thời lượng pin, dự án phụ trách và nút gọi điện thoại VoIP.
  - [x] 5 Modal tương tác không có nút chết:
    - Modal 1: Xem thỏa thuận đặt cọc điện tử A4 (`selectedContractToPreview`, Quốc hiệu, trích yếu, chữ ký số, mộc thời gian GPS, mã hash SHA-256).
    - Modal 2: Cài đặt PWA Mobile không cần App Store (`showPwaInstallModal`, mã QR lớn, hướng dẫn Add to Home Screen cho Safari & Chrome).
    - Modal 3: Ống kính quét CCCD gắn chip eKYC (`showScanIdModal`, camera giả lập với tia laser quét xanh lá cây, tự động bóc tách OCR họ tên, số CCCD, địa chỉ).
    - Modal 4: Chi tiết gói tin hàng đợi đồng bộ (`selectedQueueItemModal`, thanh tra cấu trúc Payload JSON kỹ thuật, nút ép đồng bộ ngay).
    - Modal 5: Lập lịch hẹn giờ bắn push notification (`showScheduleNotifModal`, picker ngày giờ tự động kích hoạt).
  - [x] Nút Xuất Nhật Ký (.CSV) tải trực tiếp toàn bộ dữ liệu hàng đợi ngoại tuyến và lịch sử thực địa chuẩn UTF-8 BOM.

---

### 31. Tích Hợp API, Webhook & ERP (`/integrations`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Zustand Store & Enterprise Hub).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/integrations.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/integrations.md)
- **Mục tiêu**: Cổng kết nối liên thông dữ liệu toàn diện giữa CRM với phần mềm Kế toán ERP (MISA AMIS, FAST, SAP S/4HANA), Cổng gạch nợ VietQR PRO / NAPAS 247, Cổng Zalo ZNS, Ký số VNPT SmartCA, Tổng đài Stringee VoIP và trạm truyền phát Webhooks thời gian thực.
- **Mock Data**: 12 Cổng tích hợp thực tế (Zalo, MISA, FAST, SAP, VietQR, VNPay, MoMo, VNPT eKYC, VNPT SmartCA, Stringee, Google Maps, Google Drive), 6 Outbound Webhooks, 4 Cặp khóa API doanh nghiệp bảo mật, 8 Nhật ký lưu lượng API Audit Logs thời gian thực.
- **Thành phần UI/UX**:
  - [x] Header điều hành tích hợp 4 thẻ KPI vĩ mô: Cổng Đang Kết Nối (7/12 Dịch Vụ, SLA 99.98%), Lưu Lượng Gọi API 24h (48.250 Reqs, Độ trễ 112ms), Trạm Webhooks Lắng Nghe (6/6 Trạm), Tỷ Lệ Lỗi (0.02%).
  - [x] 4 Tabs tác nghiệp toàn diện:
    - **Tab 1: Chợ Ứng Dụng (App Directory)**: Bộ lọc theo 5 danh mục nghiệp vụ (Tất cả, Giao tiếp, Tài chính & ERP, Thanh toán & VietQR, Pháp lý số, Tiện ích), ô tìm kiếm nhanh, lưới thẻ card chi tiết với công tắc bật/tắt kết nối nhanh và nút "Cấu hình & Test".
    - **Tab 2: Trạm Giám Sát Webhooks & Trình Bắn Thử Payload**: Trình giả lập Live Ping Simulator (chọn sự kiện BĐS, URL đích, bấm "🚀 Bắn Thử Sự Kiện" hiển thị HTTP 200 OK, latency ms và response body), danh sách 6 outbound webhooks với công tắc bật/tắt và nút xem payload.
    - **Tab 3: Quản Lý Khóa API Keys & Bảo Mật**: Danh sách 4 cặp khóa API doanh nghiệp, IP Whitelist, phân quyền, ngày hết hạn, nút sao chép Token 1-chạm, nút thu hồi khóa (Revoke) và lưu ý bảo mật HMAC-SHA256.
    - **Tab 4: Nhật Ký Truy Xuất & Kiểm Toán API**: Bảng theo dõi lưu lượng thời gian thực, hiển thị timestamp, method (GET, POST, PUT), endpoint, service, IP, mã status (200, 201, 401), độ trễ ms và bộ lọc 2xx/4xx.
  - [x] 5 Modal tương tác không có nút chết:
    - Modal 1: Cấu hình & Kiểm tra bắt tay mạng (`selectedAppForConfig`, nút Ping Test đo độ trễ mạng thực tế TLS 1.3 và lưu cấu hình).
    - Modal 2: Cấp phát API Key doanh nghiệp mới (`showCreateKeyModal`, form phân quyền, IP whitelist, tự động sinh khóa).
    - Modal 3: Chi tiết gói tin Webhook Payload (`selectedWebhookPayloadModal`, headers HMAC-SHA256, JSON payload, nút Replay delivery).
    - Modal 4: Yêu cầu tích hợp hệ thống mới (`showRequestIntegrationModal`, tiếp nhận bài toán mở rộng).
    - Modal 5: Cấu hình gạch nợ tự động VietQR IPN (`showVietQrConfigModal`, tài khoản CĐT, cú pháp chuẩn, nút bắn tiền cọc giả lập 200 triệu).
  - [x] Nút Xuất Báo Cáo (.CSV) tải trực tiếp toàn bộ dữ liệu cổng kết nối, API keys và nhật ký audit chuẩn UTF-8 BOM.


---

### 32. Cài Đặt Hệ Thống & Phân Quyền RBAC (`/settings`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Zustand Store & Enterprise Hub).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/settings.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/settings.md)
- **Mục tiêu**: Trạm chỉ huy tối cao dành cho Super Admin & Ban Giám Đốc quản trị nền tảng Enterprise: ma trận phân quyền 4 vai trò (RBAC), kiến trúc đa sàn White-label (Custom CNAME & Theme Presets), chính sách an ninh SOC-2 Type II (2FA, IP Whitelist, DLP, Biometric WebAuthn), nhật ký kiểm toán bất biến (Audit Log) kèm Payload JSON, sao lưu & phục hồi thảm họa (Disaster Recovery Snapshots SHA-256) và quy tắc cảnh báo leo thang tự động.
- **Mock Data**: 12 Quyền hạn RBAC chi tiết trên 4 vai trò, 8 Sự kiện Audit Log thời gian thực kèm mã hóa rủi ro, 3 Bản sao lưu Snapshot (18.5 GB), 5 Quy tắc cảnh báo leo thang (Deal > 20 Tỷ, Brute-Force, Căn sắp hết hạn...) và cấu hình Multi-tenant 3 chi nhánh.
- **Thành phần UI/UX**:
  - [x] Header điều hành tích hợp 4 thẻ KPI vĩ mô: Tài Khoản Kích Hoạt (68 Users, +4 Chờ duyệt), Cấp Bậc Vai Trò (4 Phân Tầng RBAC), Điểm Tuân Thủ Bảo Mật (98/100, Hạng A+ SOC-2), Dung Lượng Snapshot DB (18.5 GB, Tự động 02:00 AM).
  - [x] 6 Mục cấu hình hệ thống chuyên sâu (Tabs):
    - **Tab 1: Ma Trận Phân Quyền (RBAC)**: Bảng ma trận 12 quyền hạn dữ liệu trên 4 vai trò (Super Admin, Giám Đốc, Sale, Đại Lý F2), checkbox thời gian thực, bộ lọc 5 danh mục (Khách hàng, Hợp đồng, Giỏ hàng, Tài chính, Hệ thống), ô tìm kiếm quyền hạn, nút Chọn/Bỏ chọn tất cả theo vai trò và nút Khôi phục mặc định ban đầu.
    - **Tab 2: Cấu Hình Đa Sàn (Multi-tenant White-label)**: Tùy biến Custom CNAME (`crm.novacapital.vn`), nút kiểm tra DNS CNAME & SSL Wildcard, bộ chọn màu chủ đạo Primary/Accent với 6 bộ Theme Presets phong cách các tập đoàn địa ốc (Nova Indigo, Vinhomes Crimson, Masterise Gold, Ecopark Emerald, SunGroup Ocean, Hưng Thịnh Navy), công tắc đóng dấu Watermark chống rò rỉ HĐ cọc, và quản lý danh sách 3 chi nhánh sàn.
    - **Tab 3: Chính Sách An Ninh & SOC-2**: 4 Thẻ bảo mật nâng cao có công tắc gạt (2FA Bắt buộc, Tường lửa IP Whitelist, Chống rò rỉ dữ liệu DLP, Sinh trắc học WebAuthn FaceID/TouchID), bảng quản lý IP Whitelist có form thêm/xóa IP, và 4 chính sách mật khẩu/khóa phiên tự động.
    - **Tab 4: Nhật Ký Giám Sát (Security Audit Log)**: Theo dõi sự kiện an ninh thời gian thực, bộ lọc mức độ rủi ro (Tất cả, Thành Công, Cảnh Báo, Nguy Cấp), ô tìm kiếm người dùng/hành động/IP, nút "Xem Payload JSON" và nút tải thêm dữ liệu lưu trữ cũ hơn.
    - **Tab 5: Sao Lưu & Phục Hồi Thảm Họa (Disaster Recovery)**: Thống kê dung lượng DB 18.5 GB trên AWS S3, bảng lịch sử các điểm khôi phục Snapshot (Auto & Manual), mã kiểm tra SHA-256 Checksum, nút tải file nén `.sql.gz`, nút xóa và nút Khôi Phục dữ liệu.
    - **Tab 6: Quy Tắc Cảnh Báo Leo Thang (Escalation Rules)**: 5 Quy tắc tự động (Deal > 20 Tỷ, Brute-Force login, Giỏ hàng đạt > 90%, Khóa căn 15p sắp hết giờ, Xuất khách hàng bất thường) kèm công tắc Bật/Tắt và phân kênh phát tin (SMS, Telegram, Zalo ZNS, Email).
  - [x] 5 Modal tương tác không có nút chết:
    - Modal 1: Thêm tài khoản & phân vai trò mới (`showAddUserModal`, form đầy đủ, tự động tăng KPI Users).
    - Modal 2: Tạo bản sao lưu Snapshot khẩn cấp (`showCreateBackupModal`, thanh tiến trình chạy 0-100%, sinh SHA-256, chèn vào bảng snapshot).
    - Modal 3: Xác nhận khôi phục dữ liệu từ Snapshot (`selectedBackupToRestore`, yêu cầu gõ chữ CONFIRM để chống thao tác nhầm).
    - Modal 4: Chi tiết sự kiện an ninh Audit Payload (`selectedAuditLogModal`, xem metadata, Dark terminal JSON viewer, nút sao chép JSON).
    - Modal 5: Thiết lập chế độ bảo trì hệ thống toàn sàn (`showMaintenanceModal`, hẹn giờ 15p/30p/1h/2h, soạn thông điệp khóa sàn, kích hoạt banner cảnh báo header toàn hệ thống).
  - [x] Nút Xuất Báo Cáo CSV (`handleExportCSV`): Tải trực tiếp toàn bộ dữ liệu Ma trận phân quyền RBAC và Nhật ký Audit Log chuẩn UTF-8 BOM.

---

### 33. Bàn Giao Bất Động Sản & Quản Lý Nghiệm Thu Khiếm Khuyết (`/handover`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Zustand Store & Handover Hub).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/handover.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/handover.md)
- **Mục tiêu**: Chuẩn hóa toàn trình quy trình bàn giao nhà ở cao cấp, biên bản nghiệm thu 50+ chỉ tiêu kỹ thuật (Xây thô, M&E, Sàn trần, Thiết bị vệ sinh, Smartlock), ký số biên bản nhận nhà mẫu A4, điều phối tổng thầu Coteccons/Hòa Bình khắc phục lỗi bảo hành, và theo dõi tiến trình cấp Sổ Hồng 5 chặng.
- **Mock Data**: 5 Hồ sơ bàn giao căn hộ thực tế tại 5 đại dự án, 4 Khiếm khuyết kỹ thuật (Snagging defects) chi tiết kèm mức độ nghiêm trọng và tổng thầu phụ trách, các gói bảo hành kết cấu 60 tháng, chỉ số điện nước công tơ và mã số phôi Sổ Hồng Sở TN&MT.
- **Thành phần UI/UX**:
  - [x] Header điều hành tích hợp 4 thẻ KPI vĩ mô: Căn Đủ Chuẩn Bàn Giao (42 Căn, 85.2% tiến độ hoàn công), Đã Hoàn Tất Bàn Giao (128 Căn, CSAT 98.4%), Khiếm Khuyết Đang Xử Lý (14 Lỗi, SLA 3.2 ngày), Sổ Hồng Đã Trao Tay (86 Sổ Hồng).
  - [x] 4 Tabs tác nghiệp toàn diện:
    - **Tab 1: Sổ Bàn Giao & Lịch Hẹn**: Bảng danh sách căn hộ đến hạn bàn giao, bộ lọc theo Dự án & Trạng thái, ô tìm kiếm nhanh, hiển thị chỉ số điện nước, kỹ sư phụ trách, nút Xem & Ký biên bản A4, nút Xem sổ hồng, nút Bàn giao chìa khóa.
    - **Tab 2: Nghiệm Thu Khiếm Khuyết (Snagging)**: 5 Thẻ nhóm hạng mục kiểm định chất lượng (Xây thô & sơn bả, Sàn & trần, Cơ điện M&E, Thiết bị vệ sinh, Cửa & khóa), danh sách lỗi phát sinh với Badge độ nghiêm trọng, tổng thầu phụ trách, hạn xử lý SLA và nút "Nghiệm Thu Đạt".
    - **Tab 3: Bảo Hành & Bàn Giao Chìa Khóa**: 3 Gói bảo hành (Kết cấu 60 tháng, Chống thấm 24 tháng, Thiết bị 12 tháng), danh mục bàn giao 03 chìa Master, 04 thẻ thang máy phân tầng, 02 thẻ đỗ xe ô tô hầm B1, và danh bạ khẩn cấp Savills/CBRE 24/7.
    - **Tab 4: Tiến Trình Cấp Sổ Hồng**: Stepper trực quan 5 giai đoạn (Tiếp nhận hồ sơ ➔ Nộp Sở TN&MT ➔ Thẩm định thuế ➔ In phôi sổ hồng ➔ Trao sổ tận tay), danh sách căn hộ đang làm sổ kèm số phôi seri định danh.
  - [x] 5 Modal tương tác không có nút chết:
    - Modal 1: Lập lịch hẹn bàn giao nhà mới (`showAppointmentModal`, chọn căn, ngày giờ, kỹ sư Ban QLDA, ghi chú khách hàng).
    - Modal 2: Khai báo lỗi khiếm khuyết Snagging (`showAddDefectModal`, vị trí, hạng mục, mô tả, chọn tổng thầu, mức độ nghiêm trọng).
    - Modal 3: Ký số biên bản bàn giao mẫu A4 (`selectedHandoverForSign`, Quốc hiệu, trích yếu, các bên tham gia, chỉ số bàn giao, canvas ký số điện tử SHA-256).
    - Modal 4: Chi tiết hồ sơ cấp Sổ Hồng (`selectedPinkBookDetail`, số hợp đồng, số phôi sổ, checklist hồ sơ nộp Sở TN&MT).
    - Modal 5: Biên nhận bàn giao chùm chìa khóa & thẻ cư dân (`showKeyHandoverModal`, kiểm đếm chìa Master, thẻ thang máy, kích hoạt quyền cư dân di động).
  - [x] Nút Xuất Báo Cáo CSV (`handleExportCSV`): Tải trực tiếp toàn bộ dữ liệu Sổ bàn giao và Nhật ký khiếm khuyết Snagging chuẩn UTF-8 BOM.

---

### 34. Sàn Đấu Giá Bất Động Sản Trực Tuyến & Phòng Bidding VIP (`/auction`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Zustand Store & Live Auction Hub).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/auction.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/auction.md)
- **Mục tiêu**: Nền tảng đấu giá công khai minh bạch dành cho các siêu phẩm BĐS giới hạn (Dinh thự ven sông, Penthouse lõi trung tâm, Shophouse đại lộ biển); tích hợp phòng Live Bidding thời gian thực, đồng hồ búa gõ đếm ngược từng giây, âm thanh gõ búa Web Audio độc quyền, quản lý tài khoản ký quỹ phong tỏa (Escrow Vault) và biên bản trúng đấu giá A4 ký số điện tử.
- **Mock Data**: 5 Phiên đấu giá siêu phẩm thực tế tại 5 đại dự án, 6 Lượt trả giá Live Bids Feed thời gian thực, 6 Lệnh ký quỹ đặt cọc (Escrow) bảo lãnh ngân hàng VietQR/VCB và biên bản khớp lệnh thặng dư +18.2%.
- **Thành phần UI/UX**:
  - [x] Header điều hành tích hợp 4 thẻ KPI vĩ mô: Tổng Phiên Đấu Giá (12 Phiên, 3 Live), Khách Đã Ký Quỹ (48 Nhà đầu tư VIP, 36.5 Tỷ VNĐ), Lượt Đặt Giá Trong Ngày (86 Lượt BID), Tổng Giá Trị Khớp Lệnh (385.5 Tỷ VNĐ).
  - [x] 4 Tabs tác nghiệp toàn diện:
    - **Tab 1: Sàn Đấu Giá Trực Tiếp (Live)**: Thẻ Hero Live Auction khổng lồ (Biệt thự biển NVW-01.01 giá sàn 25 Tỷ, hiện tại 27.8 Tỷ, đồng hồ đếm ngược 00:04:32), nút "Vào Phòng Đấu Giá VIP", và lưới thẻ 3 phiên đấu giá live/upcoming khác.
    - **Tab 2: Danh Mục Tài Sản Đấu Giá**: Bảng danh mục tra cứu chi tiết diện tích, hướng, view, giá sàn, giá trần kỳ vọng, bước giá và mức ký quỹ bắt buộc.
    - **Tab 3: Sổ Ký Quỹ Đặt Cọc (Escrow Vault)**: Quản lý tiền ký quỹ 500Tr - 1 Tỷ qua VietQR/VCB, trạng thái phong tỏa, nút hoàn cọc nhanh cho khách không trúng.
    - **Tab 4: Lịch Sử Khớp Lệnh & Hợp Đồng**: Sổ lưu trữ các phiên chốt búa thành công, thặng dư so với giá sàn, nút xem biên bản A4.
  - [x] 5 Modal tương tác không có nút chết:
    - Modal 1: Đăng ký tham gia đấu giá & ký quỹ (`showRegisterBidderModal`, chọn phiên, thông tin nhà đầu tư, cổng thanh toán VietQR Pro).
    - Modal 2: Khởi tạo phiên đấu giá mới (`showCreateAuctionModal`, mã căn, giá sàn, bước giá, tiền ký quỹ, đấu giá viên chủ trì).
    - Modal 3: Phòng đấu giá trực tiếp Live Room (`selectedLiveRoom`, hình ảnh HD sa bàn, bảng Live Bids Feed nhảy giá thời gian thực, 4 nút bước giá nhanh, nút gõ búa đặt giá phát âm thanh Web Audio).
    - Modal 4: Biên bản xác nhận trúng đấu giá mẫu A4 (`selectedWinnerModal`, Quốc hiệu, trích yếu, các bên tham gia, giá trúng búa, khấu trừ tiền ký quỹ thành tiền cọc, chữ ký số SHA-256).
    - Modal 5: Lệnh hoàn trả tiền ký quỹ (`showRefundModal`, đối soát tài khoản ngân hàng, hoàn 100% tiền phong tỏa cho khách không trúng).
  - [x] Nút Xuất Báo Cáo CSV (`handleExportCSV`): Tải trực tiếp toàn bộ dữ liệu Phiên đấu giá và Sổ ký quỹ chuẩn UTF-8 BOM.

---

### 35. Quản Trị Vận Hành Bất Động Sản & Dịch Vụ Cư Dân (`/operations`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Zustand Store & Building Operations Hub).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/operations.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/operations.md)
- **Mục tiêu**: Trạm chỉ huy tối ưu hóa dành cho Ban Quản Lý Tòa Nhà (Savills / CBRE), Ban Quản Trị Cư Dân và Đội ngũ Kỹ sư Vận hành: Sổ hóa đơn & thu phí dịch vụ tự động kèm mã VietQR Pro, cấp phép thi công & cải tạo nội thất (Fit-out) ký quỹ PCCC 50 triệu, đặt chỗ tiện ích Clubhouse 5 sao (Pickleball, BBQ ven hồ, Hồ bơi chân mây, Cigar Lounge), và tổng đài tiếp nhận sự cố kỹ thuật cư dân 24/7 cam kết SLA 30 - 120 phút.
- **Mock Data**: 6 Hóa đơn phí dịch vụ chi tiết (phí QL 18.000đ/m², xe ô tô 1.2Tr, điện nước), 4 Giấy phép thi công nội thất Fit-out kèm danh sách công nhân và ký quỹ 50Tr, 4 Tiện ích Clubhouse 5 sao với các suất đặt chỗ theo khung giờ, 4 Phiếu sự cố kỹ thuật 24/7 kèm đồng hồ SLA.
- **Thành phần UI/UX**:
  - [x] Header điều hành tích hợp 4 thẻ KPI vĩ mô: Căn Hộ Đang Vận Hành (1,248 Căn, 88.5% lấp đầy), Thu Phí Dịch Vụ Tháng (3.85 Tỷ VNĐ, 96.2% đúng hạn), Sự Cố Kỹ Thuật Đang Xử Lý (18 Tickets, SLA 45p), Lượt Đặt Tiện Ích Tuần (142 Lượt, Tăng +18%).
  - [x] 4 Tabs tác nghiệp toàn diện:
    - **Tab 1: Hóa Đơn & Thu Phí Dịch Vụ (Service Fees & Billing)**: Bảng hóa đơn phân rã từng loại phí (Phí QL, Xe ô tô/xe máy, Điện nước), trạng thái (Đã Đóng, Chờ Thanh Toán, Quá Hạn), nút "Biên Lai A4" xem phiếu thu điện tử, nút "Nhắc Phí" gửi Zalo/SMS và nút "Gạch Nợ" cập nhật thanh toán nhanh.
    - **Tab 2: Cấp Phép Thi Công Nội Thất (Fit-out Permits)**: Danh sách nhà thầu nội thất, số lượng công nhân được cấp thẻ ra vào, tiến độ thi công, quản lý khoản tiền ký quỹ bảo đảm hoàn trả mặt bằng 50,000,000đ, nút Duyệt giấy phép và nút Nghiệm thu & hoàn cọc.
    - **Tab 3: Đặt Chỗ Tiện Ích Clubhouse (Amenities Booking)**: 4 Tiện ích đặc quyền (Sân Pickleball VIP, Khu BBQ ven hồ, Hồ bơi chân mây tầng thượng, Phòng tiệc Cigar & Lounge), sổ theo dõi khung giờ slot trong ngày và nút Check-in quét mã QR thẻ cư dân.
    - **Tab 4: Tiếp Nhận Sự Cố Kỹ Thuật 24/7 (Resident Helpdesk)**: 5 Nhóm sự cố (Điện nước, Thang máy, Vệ sinh, An ninh, Tiếng ồn), phân cấp SLA (Bình thường 120p, Trung bình 60p, Khẩn cấp 30p), nút "Xác Nhận Đã Xong" đánh giá hoàn thành.
  - [x] 5 Modal tương tác không có nút chết:
    - Modal 1: Lập hóa đơn phí quản lý định kỳ mới (`showCreateBillModal`, chọn căn, diện tích, tiền gửi xe, điện nước, tự động sinh mã VietQR).
    - Modal 2: Đăng ký cấp phép thi công nội thất (`showFitoutModal`, nhà thầu, số công nhân, cam kết ngày thi công, tiền ký quỹ PCCC 50,000,000 VNĐ).
    - Modal 3: Đặt chỗ tiện ích Clubhouse đặc quyền (`showBookAmenityModal`, chọn tiện ích, căn hộ, số khách, chọn khung giờ slot).
    - Modal 4: Khai báo sự cố kỹ thuật 24/7 (`showAddTicketModal`, chọn căn, nhóm sự cố, mô tả, mức độ khẩn cấp, phát lệnh điều phối kỹ sư).
    - Modal 5: Phiếu thu & Hóa đơn dịch vụ điện tử A4 (`selectedBillForReceipt`, Quốc hiệu, trích yếu, chi tiết phân rã các khoản phí, trạng thái đóng tiền, mã QR tra cứu hóa đơn).
  - [x] Nút Xuất Báo Cáo CSV (`handleExportCSV`): Tải trực tiếp toàn bộ dữ liệu Sổ thu phí dịch vụ và Nhật ký sự cố kỹ thuật chuẩn UTF-8 BOM.

---

### 36. Sàn Ký Gửi & Thị Trường Thứ Cấp (Bán Lại & Cho Thuê) (`/resale`)
- [x] **Trạng thái**: Hoàn thiện toàn diện 100% Mock Data & UI/UX tương tác (Zustand Store & Secondary Market Hub).
- 📖 **Tài liệu kỹ thuật & nghiệp vụ chi tiết**: [docs/modules/resale.md](file:///c:/Users/catmu/Downloads/crm/docs/modules/resale.md)
- **Mục tiêu**: Trung tâm kết nối toàn trình dành cho thị trường mua đi bán lại (Resale) và cho thuê (Rental): Tiếp nhận ký gửi độc quyền 60 ngày, định giá thị trường CMA, bộ máy so khớp tự động AI Smart Matcher (Lead-to-Listing), quản lý tủ chìa khóa Master và Smartlock Passcode xem nhà thực tế, biên bản thỏa thuận đặt cọc ba bên A4 phong tỏa tiền cọc Escrow và quyết toán hoa hồng 50/50.
- **Mock Data**: 6 Sản phẩm BĐS thứ cấp cao cấp (The Grand Manhattan, Aqua City, The Global City, NovaWorld, Eco Green), 4 Hồ sơ nhu cầu khách mua/thuê AI Match (92% - 98%), 4 Lịch dẫn khách xem nhà thực tế kèm nguồn chìa khóa, 3 Giao dịch thứ cấp chốt cọc thành công đã phân bổ hoa hồng.
- **Thành phần UI/UX**:
  - [x] Header điều hành tích hợp 4 thẻ KPI vĩ mô: Rổ Hàng Ký Gửi Đang Mở (156 Căn, 62% độc quyền), Tổng Giá Trị Ký Gửi GMV (1,420 Tỷ VNĐ, +22.4% MoM), Nhu Cầu Khách Đang Khớp (84 Hồ Sơ, tương thích 91.5%), Hoa Hồng Thứ Cấp Tháng Này (1.85 Tỷ VNĐ, 12 deals chốt).
  - [x] 4 Tabs tác nghiệp toàn diện:
    - **Tab 1: Nguồn Hàng Ký Gửi (Resale & Rental Listings)**: Lưới thẻ BĐS cao cấp, bộ lọc chip (Tất cả, Bán lại, Cho thuê, Độc quyền), dropdown dự án, ô tìm kiếm, hiển thị giá niêm yết, hoa hồng sàn, thông số PN, WC, diện tích, pháp lý, nguồn giữ chìa khóa, banner AI Match khách, nút "HĐ Ký Gửi A4" và nút "Lên Lịch Xem Nhà".
    - **Tab 2: Nhu Cầu Mua / Thuê & AI Smart Match**: Danh sách khách hàng có nhu cầu mua lại/thuê, ngân sách tối thiểu - tối đa, mục đích, mức độ cấp bách, điểm phù hợp AI Smart Match (98%, 95%...), nút "Hẹn Xem Căn Này" và nút "Gửi Zalo".
    - **Tab 3: Sổ Quản Lý Chìa Khóa & Dẫn Khách (Key Vault & Showings)**: Thống kê Tủ chìa khóa Master sàn (18 chìa), Mã Smartlock (12 căn), Lịch hẹn hôm nay, bảng nhật ký điều phối dẫn khách kèm trạng thái và phản hồi thực tế.
    - **Tab 4: Chốt Deal Thứ Cấp & Quyết Toán Hoa Hồng (Closings & Escrow)**: Bảng giao dịch chuyển nhượng/cho thuê đã vào cọc, giá chốt, tiền cọc, phân bổ thù lao 50% Sale : 50% Sàn, trạng thái công chứng sang tên và nút mở HĐ Cọc Ba Bên A4.
  - [x] 5 Modal tương tác không có nút chết:
    - Modal 1: Tiếp nhận ký gửi mới (`showConsignmentModal`, hình thức bán/thuê, dự án, mã căn, tên chủ nhà, SĐT, giá niêm yết, hoa hồng cam kết, hiện trạng giữ chìa, ký độc quyền 60 ngày).
    - Modal 2: Đăng ký nhu cầu mua / thuê (`showDemandModal`, tên khách, SĐT, loại nhu cầu, dự án nhắm tới, khoảng ngân sách, số PN, độ cấp bách, kích hoạt AI so khớp).
    - Modal 3: Đặt lịch dẫn khách xem nhà (`showScheduleModal`, chọn căn, khách hàng, ngày giờ hẹn, chuyên viên dẫn khách, thông tin lấy chìa khóa).
    - Modal 4: Hợp đồng môi giới ký gửi độc quyền mẫu A4 (`selectedListingForAgreement`, Quốc hiệu, tiêu ngữ, Đại diện Sàn Nova & Bên Ký Gửi, mã căn, giá net, hoa hồng, điều khoản độc quyền, chữ ký số SHA-256).
    - Modal 5: Thỏa thuận đặt cọc ba bên thứ cấp mẫu A4 (`selectedDealForDeposit`, Bên Bán - Bên Mua - Bên C làm chứng và giữ cọc Escrow, chi tiết thuế TNCN 2%, lệ phí trước bạ 0.5%, tiền hoa hồng).
    - Popup bổ trợ: Xem danh sách khách hàng đang khớp của căn ký gửi (`selectedMatchListing`).
  - [x] Nút Xuất Báo Cáo CSV (`handleExportCSV`): Tải trực tiếp toàn bộ dữ liệu Rổ hàng ký gửi, Sổ nhu cầu khách, Lịch dẫn khách và Sổ giao dịch chốt cọc chuẩn UTF-8 BOM.

---

## 🎯 5 NGUYÊN TẮC NGHIỆM THU MỖI TRANG (DEFINITION OF DONE)

Khi bạn hoàn thành bất kỳ trang nào trong danh sách trên, hãy tự kiểm tra 5 tiêu chí:
1. **Dữ liệu Mock chân thực**: Sử dụng số tiền VNĐ, địa danh, tên dự án và khách hàng thực tế tại Việt Nam.
2. **Không nút chết (No Dead Elements)**: Mọi nút bấm đều phải kích hoạt Modal, thay đổi State hoặc hiển thị thông báo Toast.
3. **Tìm kiếm & Bộ lọc tức thì**: Thay đổi ô tìm kiếm hoặc dropdown bộ lọc phải cập nhật ngay danh sách dữ liệu hiển thị.
4. **Giao diện Responsive**: Bố cục co giãn hài hòa trên màn hình Desktop, Tablet và Mobile.
5. **Zero Error Compilation**: Chạy `npm run build` thành công, không có bất kỳ lỗi cú pháp hoặc TypeScript nào.
