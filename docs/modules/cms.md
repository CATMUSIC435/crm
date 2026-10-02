# Phân Hệ Quản Trị Nội Dung (CMS) & Tối Ưu SEO - Module `/cms`

## 1. Tổng Quan & Tầm Nhìn Kiến Trúc CMS Bất Động Sản

Trong chiến lược tiếp thị bất động sản hiện đại, việc phụ thuộc hoàn toàn vào quảng cáo trả phí (Paid Ads như Facebook/Google Ads) sẽ khiến chi phí mua khách hàng (CAC) ngày càng tăng cao. **Hệ thống Quản Trị Nội Dung (CMS) & Tối Ưu SEO (`/cms`)** là cỗ máy tạo **khách hàng tiềm năng tự nhiên (Organic Inbound Leads)** bền vững với chi phí 0 đồng cho sàn giao dịch bất động sản Nova CRM.

Hệ thống được thiết kế theo chuẩn báo chí điện tử cao cấp và tuân thủ nghiêm ngặt các nguyên tắc thuật toán tìm kiếm của Google (Google Core Web Vitals & Helpful Content Guidelines):

* **Kho bài viết & Cẩm nang đầu tư chuyên sâu**: Xuất bản tin tức cập nhật biến động giá đất, tiến độ hạ tầng liên vùng (Vành Đai 3, Cao tốc Dầu Giây - Phan Thiết, Sân bay Long Thành), phân tích pháp lý 1/500 và cẩm nang tài chính vay vốn ngân hàng.
* **Trình mô phỏng kết quả tìm kiếm Google (Google SERP Simulator)**: Đo lường độ dài Title Tag, Meta Description theo thời gian thực và mô phỏng chính xác giao diện tìm kiếm Google Desktop/Mobile.
* **Bộ đo điểm SEO Onpage tự động**: Chấm điểm từ 0 đến 100 điểm dựa trên tiêu chuẩn Google RankBrain, cảnh báo tức thì khi tiêu đề bị cắt xén hoặc thẻ mô tả quá ngắn/quá dài.
* **Hệ thống trang đích (Landing Pages Lead Magnet)**: Đo lường số lượt truy cập (Visitors), số Leads thu về và tỷ lệ chuyển đổi (CVR %) trên từng dự án mở bán.
* **Quản trị biển bảng quảng cáo (Banners & Popups)**: Quản lý Hero Banner trang chủ, Modal Popup chào đón thành viên và Exit-Intent Popup giữ chân khách hàng khi chuẩn bị rời trang.

```
+-----------------------------------------------------------------------------------+
|               HỆ THỐNG QUẢN TRỊ NỘI DUNG (CMS) & TỐI ƯU SEO (/cms)                |
+-----------------------------------------------------------------------------------+
                                          |
          +-------------------------------+-------------------------------+
          |                               |                               |
          v                               v                               v
+-------------------+           +-------------------+           +-------------------+
| KHO BÀI VIẾT BĐS  |           | GOOGLE SERP       |           | LANDING PAGES     |
| & CHUYÊN MỤC      |           | & SEO SIMULATOR   |           | & BANNER POPUPS   |
+-------------------+           +-------------------+           +-------------------+
| - Tin tức thị trường|         | - Title (50-65 ký tự|         | - Trang đích CVR %|
| - Cẩm nang đầu tư |           | - Meta (120-165 ký tự|        | - Hero Banners    |
| - Tiến độ hạ tầng |           | - Điểm SEO 0-100  |           | - Exit Intent     |
| - Đọc dạng báo chí|           | - Snippet Preview |           | - Bật/Tắt Live    |
+-------------------+           +-------------------+           +-------------------+
```

---

## 2. Cấu Trúc Kỹ Thuật & Luồng Dữ Liệu (Technical Architecture)

### 2.1 File Components & Đường Dẫn
* **Giao diện điều khiển trung tâm**: [`app/(dashboard)/cms/page.tsx`](file:///c:/Users/catmu/Downloads/crm/app/(dashboard)/cms/page.tsx)
* **Tài liệu kỹ thuật module**: [`docs/modules/cms.md`](file:///c:/Users/catmu/Downloads/crm/docs/modules/cms.md)
* **Kho lưu trữ trạng thái toàn cục**: [`store/useStore.ts`](file:///c:/Users/catmu/Downloads/crm/store/useStore.ts)
* **Khai báo kiểu dữ liệu**: [`types/index.ts`](file:///c:/Users/catmu/Downloads/crm/types/index.ts)

### 2.2 Mô Hình Dữ Liệu Thực Thể (Data Models)

#### Entity `Article` (Bài viết tin tức & cẩm nang)
```typescript
export interface Article {
  id: string;                           // Mã bài viết duy nhất (a1, a2,...)
  title: string;                        // Tiêu đề bài viết (Title Tag)
  category: string;                     // Chuyên mục: 'Thị trường' | 'Tài chính' | 'Tiến độ dự án' | 'Cẩm nang đầu tư'
  status: 'published' | 'draft';        // Trạng thái xuất bản
  views: number;                        // Lượt xem tích lũy (Traffic)
  seoScore: number;                     // Điểm tối ưu Onpage SEO (0 - 100)
  slug: string;                         // Đường dẫn URL thân thiện không dấu
  excerpt: string;                      // Mô tả ngắn Meta Description
  content?: string;                     // Nội dung chi tiết bài viết
  author?: string;                      // Tác giả hoặc chuyên viên phân tích
  publishedDate?: string;               // Ngày xuất bản
  thumbnail?: string;                   // Ảnh đại diện chất lượng cao
  tags?: string[];                      // Thẻ từ khóa liên kết
}
```

#### Entity `LandingPage` (Trang đích thu Lead)
```typescript
export interface LandingPage {
  id: string;                           // Mã landing page (lp1, lp2,...)
  name: string;                         // Tên chiến dịch trang đích
  url: string;                          // Đường dẫn slug (VD: /aqua-city-booking)
  visitors: number;                     // Tổng lượt truy cập
  leads: number;                        // Số data khách hàng thu về
  conversion: number;                   // Tỷ lệ chuyển đổi (%) = (leads / visitors) * 100
  status: boolean;                      // Trạng thái: true (Live) | false (Offline)
  projectId?: string;                   // Liên kết với đại dự án trong CRM
  createdAt?: string;                   // Ngày tạo
}
```

#### Entity `BannerItem` (Biển bảng & Popup)
```typescript
export interface BannerItem {
  id: number;                           // ID banner
  name: string;                         // Tên banner mô tả
  type: 'Hero Banner' | 'Modal Popup' | 'Exit Intent' | 'Sidebar Banner';
  status: boolean;                      // Bật/Tắt hiển thị
  schedule: string;                     // Lịch trình áp dụng
  image: string;                        // Đường dẫn ảnh banner
  linkUrl?: string;                     // Đường link khi người dùng nhấp vào
  clicks?: number;                      // Lượt click
  impressions?: number;                 // Lượt hiển thị
}
```

### 2.3 Các Actions Tương Tác Trong Zustand Store

```typescript
// Thêm mới bài viết lên cổng tin tức
addArticle: (article: Omit<Article, 'id'>) => void;

// Chỉnh sửa tiêu đề, chuyên mục, điểm SEO, trạng thái
updateArticle: (id: string, data: Partial<Article>) => void;

// Xóa bài viết khỏi cơ sở dữ liệu
deleteArticle: (id: string) => void;

// Khởi tạo trang đích mới
addLandingPage: (page: Omit<LandingPage, 'id'>) => void;

// Bật / Tắt trạng thái hoạt động của Landing Page
toggleLandingPageStatus: (id: string) => void;
```

---

## 3. Thuật Toán Chấm Điểm SEO & Trình Mô Phỏng Google SERP

### 3.1 Thuật Toán Đo Lường Điểm SEO (SEO Score Engine)
Hệ thống tự động tính toán điểm tối ưu SEO theo thời gian thực (Real-time reactivity) dựa trên các trọng số kỹ thuật:

$$\text{SEO Score} = \text{Base (50)} + \text{Title Bonus (25)} + \text{Excerpt Bonus (25)}$$

* **Tiêu chí Title Tag (50 - 65 ký tự)**:
  * Nếu $50 \le \text{Length(Title)} \le 65$: Đạt chuẩn vàng hiển thị trọn vẹn trên Google Desktop & Mobile $\to +25\text{ điểm}$.
  * Nếu $\text{Length(Title)} > 0$ nhưng không nằm trong khoảng vàng: Bị phạt hoặc chỉ cộng $10\text{ điểm}$ (nguy cơ bị Google cắt đuôi `...`).
* **Tiêu chí Meta Description (120 - 165 ký tự)**:
  * Nếu $120 \le \text{Length(Excerpt)} \le 165$: Đạt chuẩn vàng kích thích tỷ lệ nhấp CTR $\to +25\text{ điểm}$.
  * Nếu ngắn hơn hoặc dài hơn: Chỉ cộng $10\text{ điểm}$.
* **Quy chuẩn URL Slug**:
  * Tự động loại bỏ dấu tiếng Việt, chuyển chữ thường, thay khoảng trắng bằng dấu gạch ngang (`-`), loại bỏ ký tự đặc biệt (VD: `bang-gia-aqua-city-thang-7`).

### 3.2 Khung Xem Trước Google SERP Snippet
Render chính xác giao diện kết quả tìm kiếm Google với cấu trúc:
* **Favicon & Tên thương hiệu**: Logo Nova CRM, đường dẫn breadcrumb: `https://novacrm.vn › tin-tuc › thi-truong`.
* **Tiêu đề xanh Google**: Font chữ `#1a0dab` cỡ 17px, đường gạch chân khi hover chuột.
* **Mô tả xám chuẩn**: Font chữ `#4d5156` cỡ 12px, giới hạn tối đa 2 dòng hiển thị.

---

## 4. Quản Lý Trang Đích (Landing Pages) & Biển Bảng Quảng Cáo (Banners)

### 4.1 Trang Đích (Landing Pages)
* Đóng vai trò là thỏi nam châm hút khách (Lead Magnet) từ các chiến dịch Digital Ads.
* **Đo lường hiệu suất thời gian thực**:
  $$\text{CVR (\%)} = \left(\frac{\text{Số Leads}}{\text{Lượt Truy Cập}}\right) \times 100\%$$
* Công tắc **Bật/Tắt Live Status**: Khi chiến dịch kết thúc, quản trị viên có thể tạm tắt landing page chỉ bằng 1 thao tác mà không cần can thiệp mã nguồn server.

### 4.2 Biển Bảng Quảng Cáo & Popups
Hỗ trợ 4 loại hình hiển thị thông minh:
1. **Hero Banner**: Banner trượt khổ lớn ở đầu trang chủ, kích thước 1200x500px, quảng bá các đại dự án trọng điểm.
2. **Modal Popup**: Tự động mở hộp thoại khi khách hàng đăng nhập, thông báo voucher quà tặng hoặc sự kiện mở bán.
3. **Exit Intent Popup**: Nhận diện hành vi rê chuột chuẩn bị đóng tab trình duyệt để kích hoạt popup ưu đãi giữ chân khách hàng (tỷ lệ chuyển đổi thu thêm 15% khách).
4. **Sidebar Banner**: Hiển thị cố định ở cột bên phải của các bài viết tin tức.

---

## 5. Danh Sách 5 Modal Tác Nghiệp Chuyên Sâu

1. **Modal 1: Soạn Thảo & Đăng Bài Viết Mới**:
   * Cung cấp form nhập Tiêu đề, Chuyên mục, Tác giả, Link ảnh bìa, Đoạn trích dẫn meta và tùy chọn Xuất bản ngay hoặc Lưu bản nháp.
2. **Modal 2: Chỉnh Sửa Bài Viết Đang Có**:
   * Cho phép biên tập viên chỉnh sửa nội dung bài viết, cập nhật lại thẻ meta và đổi trạng thái bài viết nhanh chóng.
3. **Modal 3: Bản Xem Trước Bài Viết Chuẩn Báo Chí BĐS**:
   * Trình bày bài viết theo phong cách tạp chí bất động sản thượng lưu: Tiêu đề lớn, thông tin tác giả, ảnh bìa nổi bật, đoạn Sapo in nghiêng, nội dung bài viết phân tích chuyên sâu và **Form thu thập thông tin khách hàng nhận bảng giá** ngay trong bài đọc.
4. **Modal 4: Thêm Banner / Popup Quảng Cáo Mới**:
   * Khởi tạo banner mới, cấu hình lịch trình hiển thị và đường link chuyển hướng khi click.
5. **Modal 5: Khởi Tạo Landing Page Mới**:
   * Khởi tạo đường dẫn trang đích mới, liên kết với dự án trong CRM và tích hợp sẵn pixel tracking.

---

## 6. Quy Trình Vận Hành Tiêu Chuẩn Cho Đội Ngũ Biên Tập (SOP)

```
[ Biên Tập Viên Soạn Bài Viết Mới ]
                 |
                 v
[ Kiểm Tra Độ Dài Tiêu Đề (50-65 ký tự) & Meta Description (120-165 ký tự) ]
                 |
                 v
[ Trình Mô Phỏng Google SERP Chấm Điểm SEO >= 85 Điểm ]
                 |
        +--------+--------+
        |                 |
  Điểm SEO < 85     Điểm SEO >= 85
        |                 |
        v                 v
[ Tinh Chỉnh Lại   [ Chọn "Xuất Bản Ngay (Published)" ]
  Nội Dung ]              |
                          v
                   [ Hệ Thống Tự Động Đẩy Bài Lên Cổng Tin Tức ]
                          |
                          v
                   [ Khách Đọc Bài Viết ➔ Điền Form Cuối Bài ➔ Lead Đổ Về CRM ]
```

---

## 7. Tổng Kết

Phân hệ **Quản Trị Nội Dung (CMS) & Tối Ưu SEO (`/cms`)** hoàn thiện mảnh ghép thứ hai trong **Giai Đoạn 4 (Tiếp Thị & Mạng Lưới Đối Tác)**:
* Chuyển hóa website sàn giao dịch từ một trang tĩnh đơn thuần thành một **cổng thông tin thị trường uy tín số 1**.
* Tự động hóa quy trình kiểm toán SEO giúp mọi bài viết đều có cơ hội lọt vào **Top 3 trang nhất Google**.
* Tích hợp khép kín giữa nội dung tin tức, trang đích quảng cáo, biển bảng và hệ thống quản lý khách hàng CRM.
