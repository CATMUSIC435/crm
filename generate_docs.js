const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'docs', 'modules');

// Tạo thư mục nếu chưa có
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

const MODULES = [
  { id: 'bi', title: 'Dashboard BI', group: 'Dashboards', desc: 'Trung tâm phân tích dữ liệu vĩ mô. Trực quan hóa dữ liệu bằng các biểu đồ thể hiện Xu hướng doanh thu, Tỷ lệ chuyển đổi và Chi phí trên mỗi khách hàng (CPL).' },
  { id: 'portfolio', title: 'Quản lý Đầu tư', group: 'Dashboards', desc: 'Dành riêng cho Khách hàng VIP hoặc Quản lý cấp cao theo dõi hiệu quả đầu tư. Báo cáo tỷ suất sinh lời (ROI), Định giá hiện tại của các tài sản.' },
  { id: 'manager', title: 'Dashboard Quản lý', group: 'Dashboards', desc: 'Báo cáo hoạt động của đội ngũ kinh doanh (Sales). Hiển thị Tỷ lệ chuyển đổi, top dự án bán chạy, số lượng hợp đồng mới.' },
  { id: 'director', title: 'Dashboard Giám đốc', group: 'Dashboards', desc: 'Tầm nhìn toàn cảnh về dòng tiền. Hiển thị tổng doanh thu, tốc độ tiêu thụ rổ hàng, tổng hợp đồng đã chốt.' },
  { id: 'agent', title: 'Dashboard Cá nhân', group: 'Dashboards', desc: 'Bàn làm việc của nhân viên Sale. Theo dõi KPI cá nhân, doanh số cá nhân, dự tính hoa hồng và khách hàng cần chăm sóc.' },
  { id: 'customers', title: 'Khách hàng', group: 'Core CRM', desc: 'Danh bạ lưu trữ thông tin toàn bộ Khách hàng, phân loại xếp hạng (VIP, Tiềm năng) và trạng thái chăm sóc.' },
  { id: 'projects', title: 'Kho Dự án', group: 'Core CRM', desc: 'Hồ sơ các dự án Bất động sản đang mở bán. Hiển thị tình trạng, Tổng số căn, Số căn đã bán và Doanh thu.' },
  { id: 'inventory', title: 'Rổ hàng', group: 'Core CRM', desc: 'Bảng theo dõi tình trạng từng căn hộ/sản phẩm (Trống, Booking, Đã bán). Cho phép Sale thao tác Giữ chỗ.' },
  { id: 'contracts', title: 'Hợp đồng', group: 'Core CRM', desc: 'Quản lý vòng đời pháp lý. Danh sách hợp đồng mua bán, giá trị hợp đồng, liên kết chặt chẽ.' },
  { id: 'booking', title: 'Quy trình Đặt chỗ', group: 'Core CRM', desc: 'Bảng Kanban trực quan kéo thả để theo dõi tiến trình của một giao dịch từ lúc Tư vấn -> Đặt cọc.' },
  { id: 'call-center', title: 'Tổng đài', group: 'Communication', desc: 'Tích hợp gọi điện trực tiếp trên phần mềm (Softphone). Ghi âm cuộc gọi, AI phân tích cảm xúc.' },
  { id: 'marketing', title: 'Chiến dịch Marketing', group: 'Communication', desc: 'Công cụ gửi thông điệp tự động. Hỗ trợ đa kênh: Zalo OA (ZNS), SMS Brandname, Mass Email.' },
  { id: 'loyalty', title: 'Chăm sóc Khách hàng', group: 'Communication', desc: 'Quản lý hội viên (Thẻ VIP, Ruby, Diamond). Tích điểm đổi quà, quản lý Voucher khuyến mãi.' },
  { id: 'surveys', title: 'Khảo sát', group: 'Communication', desc: 'Ghi nhận Feedback của khách hàng sau mua. Tổng hợp đánh giá từ nhiều nguồn và hiển thị CSAT.' },
  { id: 'chat', title: 'Tin nhắn Nội bộ', group: 'Communication', desc: 'Kênh giao tiếp thời gian thực cho nhân viên. Chia nhóm chat theo Dự án, theo team phòng ban.' },
  { id: 'tasks', title: 'Công việc & Lịch', group: 'Operations', desc: 'Kanban giao việc nội bộ. Theo dõi deadline, độ ưu tiên (Priority).' },
  { id: 'documents', title: 'Kho Tài liệu', group: 'Operations', desc: 'Lưu trữ tập trung các tài liệu bán hàng (Chính sách, File PDF, Video TVC).' },
  { id: 'events', title: 'Sự kiện', group: 'Operations', desc: 'Quản lý Event mở bán, Webinar. Theo dõi lượng khách đăng ký, sử dụng mã QR (Scanner) để Check-in.' },
  { id: 'workflow', title: 'Tự động hóa', group: 'Operations', desc: 'Công cụ lập trình kịch bản tự động. Tự tạo luồng "Nếu - Thì" (Workflow).' },
  { id: 'ai-knowledge', title: 'AI Trợ lý Kiến thức', group: 'Advanced', desc: 'Khung chat AI được huấn luyện bằng tài liệu dự án để tư vấn và giải đáp thắc mắc nội bộ.' },
  { id: 'document-ai', title: 'AI Bóc tách Tài liệu', group: 'Advanced', desc: 'Sử dụng OCR để đọc CCCD, Hộ chiếu, hoặc Hợp đồng giấy, tự động điền thông tin.' },
  { id: 'gis', title: 'Bản đồ Quy hoạch', group: 'Advanced', desc: 'Bản đồ tương tác định vị các dự án, vùng quy hoạch. Xem vị trí hạ tầng giao thông.' },
  { id: 'panorama', title: 'Toàn cảnh 360', group: 'Advanced', desc: 'Cho phép khách hàng trải nghiệm xem nhà mẫu, sa bàn ảo bằng góc nhìn 3D.' },
  { id: 'market-data', title: 'Dữ liệu Thị trường', group: 'Extensions', desc: 'Cập nhật tin tức, biểu đồ giá BĐS khu vực để Sale có căn cứ tư vấn nhà đầu tư.' },
  { id: 'marketplace', title: 'Thương mại điện tử', group: 'Extensions', desc: 'Sàn giao dịch thứ cấp cho phép khách hàng đăng bán lại (Resale) sản phẩm đã mua.' },
  { id: 'gamification', title: 'Game hóa', group: 'Extensions', desc: 'Tạo các minigame, vòng quay may mắn, đua top doanh số.' },
  { id: 'mortgage', title: 'Hỗ trợ Vay vốn', group: 'Extensions', desc: 'Máy tính tính toán lịch trả nợ ngân hàng chi tiết hàng tháng, so sánh lãi suất.' },
  { id: 'referral', title: 'Tiếp thị Liên kết', group: 'Extensions', desc: 'Quản lý mạng lưới CTV (Cộng tác viên). Cấp mã giới thiệu, theo dõi hoa hồng.' },
  { id: 'cms', title: 'Quản lý Nội dung', group: 'Extensions', desc: 'Công cụ đăng bài viết tin tức, thiết lập nội dung hiển thị trên trang chủ.' },
  { id: 'mobile', title: 'App Di động', group: 'Extensions', desc: 'Cấu hình thông báo Push Notification, quản lý phiên bản cập nhật của ứng dụng di động.' },
  { id: 'integrations', title: 'Tích hợp bên thứ 3', group: 'Extensions', desc: 'Quản lý mã API Keys, kết nối CRM với hệ thống Kế toán, ERP, hoặc nền tảng quảng cáo.' },
  { id: 'settings', title: 'Cài đặt Hệ thống', group: 'Extensions', desc: 'Trung tâm cấu hình quản lý User, phân quyền Role, cài đặt giao diện (Theme) và bảo mật.' }
];

MODULES.forEach(mod => {
  const content = `# Phân hệ: ${mod.title}

**ID Module:** \`${mod.id}\`
**Nhóm:** ${mod.group}
**Đường dẫn truy cập:** \`/app/(dashboard)/${mod.id}\`

## 1. Tổng quan
${mod.desc}

## 2. Kiến trúc dữ liệu (Data Integration)
Module này đã được kết nối với hệ thống State Management tập trung thông qua \`useStore\` (Zustand). 
Nó loại bỏ các mock data cứng và ánh xạ dữ liệu trực tiếp từ các entity chính như \`Customer\`, \`Project\`, \`InventoryItem\`, \`Contract\`.

## 3. Các tính năng chính
- Tự động đồng bộ số liệu thời gian thực (Real-time synchronization).
- Áp dụng cấu trúc TypeScript nghiêm ngặt để đảm bảo Data Types.
- Thiết kế giao diện (UI) thân thiện với thiết bị di động (Mobile Responsive), không vỡ bảng.
`;

  const filePath = path.join(docsDir, `${mod.id}.md`);
  fs.writeFileSync(filePath, content, 'utf8');
});

console.log(`Successfully generated ${MODULES.length} markdown documents in /docs/modules/`);
