# Phân Hệ Marketing Automation & Phân Bổ Lead Tự Động - Module `/marketing`

## 1. Tổng Quan & Tầm Nhìn Kiến Trúc Marketing Hub

Trong ngành kinh doanh bất động sản giá trị cao (ticket size từ 10 tỷ đến 50 tỷ VNĐ), chi phí để thu hút một khách hàng tiềm năng (Lead) là rất lớn. Nếu Lead đổ về từ các chiến dịch quảng cáo kỹ thuật số (Facebook Ads, Google Search, TikTok Ads, Zalo ZNS) không được tiếp nhận và xử lý trong **"khung giờ vàng 15 phút đầu tiên"**, tỷ lệ chuyển đổi sẽ sụt giảm đến **70%**.

Phân hệ **Marketing Automation & Smart Lead Routing (`/marketing`)** mở màn cho **Giai đoạn 4: Tiếp Thị, Khách Hàng & Mạng Lưới Đối Tác** trong hệ sinh thái Nova CRM. Phân hệ đóng vai trò như một trạm điều phối trung tâm (Marketing Command Center):

* **Điều hành đa kênh Omnichannel**: Quản trị ngân sách, theo dõi chỉ số CPL (Cost per Lead), CVR (Conversion Rate), CTR và ROAS trên toàn bộ 4 kênh quảng cáo trọng điểm.
* **Hệ thống phân bổ Lead tự động (Smart Lead Routing Engine)**: Phân phối Lead tức thì theo thuật toán *Ưu tiên Top Seller (Weighted)*, *Xoay vòng đều (Round-Robin)*, hoặc *Theo chuyên môn dự án*.
* **Cơ chế kiểm soát SLA phản hồi 15 phút**: Đồng hồ đếm ngược thời gian thực, tự động thu hồi và điều chuyển Lead (Auto Re-assign) cho chuyên viên khác nếu sale hiện tại không liên hệ trong 15 phút.
* **Bộ công cụ kỹ thuật số**: Trình tạo UTM link động, sinh mã QR Standee sự kiện tự động và kiểm soát trạng thái kết nối máy chủ của Meta CAPI, Google Tag Manager, TikTok Pixel, Zalo Webhook.
* **Thư viện mẫu Landing Page chuẩn BĐS**: Mẫu trang đích tối ưu hóa tỷ lệ chuyển đổi kèm giả lập khung điện thoại iPhone 16 Pro Responsive.

```
+-----------------------------------------------------------------------------------+
|               MARKETING AUTOMATION & SMART LEAD ROUTING (/marketing)              |
+-----------------------------------------------------------------------------------+
                                          |
          +-------------------------------+-------------------------------+
          |                               |                               |
          v                               v                               v
+-------------------+           +-------------------+           +-------------------+
| QUẢN TRỊ ĐA KÊNH  |           | SMART LEAD ROUTING|           | TRACKING & TOOLS  |
| VÀ PHỄU CHUYỂN ĐỔI|           | & SLA ENGINE      |           | & LANDING PAGES   |
+-------------------+           +-------------------+           +-------------------+
| - Facebook Ads    |           | - Round-Robin 1:1 |           | - Live UTM Builder|
| - Google Search   |           | - Top Seller Wgt  |           | - Dynamic QR Code |
| - TikTok Ads      |           | - Project Match   |           | - Pixels & CAPI   |
| - Zalo OA / ZNS   |           | - SLA 15 phút     |           | - Mobile Mockup   |
| - 6-Stage Funnel  |           | - Re-assign tự động|          | - CSV Data Export |
+-------------------+           +-------------------+           +-------------------+
```

---

## 2. Cấu Trúc Kỹ Thuật & Luồng Dữ Liệu (Technical Architecture)

### 2.1 File Components & Đường Dẫn
* **Giao diện điều khiển trung tâm**: [`app/(dashboard)/marketing/page.tsx`](file:///c:/Users/catmu/Downloads/crm/app/(dashboard)/marketing/page.tsx)
* **Tài liệu kỹ thuật module**: [`docs/modules/marketing.md`](file:///c:/Users/catmu/Downloads/crm/docs/modules/marketing.md)
* **Kho lưu trữ trạng thái toàn cục**: [`store/useStore.ts`](file:///c:/Users/catmu/Downloads/crm/store/useStore.ts)
* **Khai báo kiểu dữ liệu**: [`types/index.ts`](file:///c:/Users/catmu/Downloads/crm/types/index.ts)

### 2.2 Mô Hình Dữ Liệu Thực Thể (Data Models)

#### Entity `Campaign`
```typescript
export interface Campaign {
  id: string;                                          // Mã định danh chiến dịch (c1, c2,...)
  name: string;                                        // Tên chiến dịch hiển thị
  platform: 'Facebook' | 'Google' | 'TikTok' | 'Zalo' | 'Email';
  status: 'Active' | 'Paused' | 'Completed';           // Trạng thái vận hành
  budget: number;                                      // Ngân sách dự kiến (VNĐ)
  spent: number;                                       // Ngân sách thực tế đã tiêu (VNĐ)
  leads: number;                                       // Tổng số leads thu về từ form
  clicks: number;                                      // Lượt click quảng cáo
  startDate: string;                                   // Ngày bắt đầu
  endDate?: string;                                    // Ngày kết thúc
  targetCPL?: number;                                  // Chi phí mục tiêu tối đa cho 1 Lead (VNĐ)
  routingRule?: 'round_robin' | 'top_seller' | 'by_project'; // Thuật toán chia lead
  assignedTeam?: string;                               // Đội ngũ phụ trách tiếp nhận
  projectId?: string;                                  // Liên kết đại dự án trong CRM
}
```

#### Entity `InboundLead`
```typescript
export interface InboundLead {
  id: string;                                          // Mã Lead duy nhất (VD: LD-8821)
  campaignId: string;                                  // ID chiến dịch nguồn
  campaignName: string;                                // Tên chiến dịch nguồn
  customerName: string;                                // Họ tên khách hàng
  phone: string;                                       // Số điện thoại liên hệ
  email: string;                                       // Email
  platform: 'Facebook' | 'Google' | 'TikTok' | 'Zalo';
  projectInterested: string;                           // Dự án và loại hình khách quan tâm
  assignedAgent: string;                               // Chuyên viên kinh doanh được phân bổ
  status: 'Mới' | 'Đã gọi' | 'Hẹn xem sa bàn' | 'Đã cọc' | 'Không nghe máy';
  inflowTime: string;                                  // Thời điểm đổ về
  slaRemainingMinutes: number;                         // Số phút còn lại trong hạn định SLA
  notes?: string;                                      // Ghi chú nhu cầu từ form hoặc sale
}
```

### 2.3 Các Actions Tương Tác Trong Zustand Store

```typescript
// Thêm mới chiến dịch quảng cáo
addCampaign: (campaign: Omit<Campaign, 'id'>) => void;

// Bật / Tạm dừng chiến dịch trực tiếp
updateCampaignStatus: (id: string, status: Campaign['status']) => void;

// Cộng dồn Lead khi có khách hàng điền form
addLeadToCampaign: (campaignId: string, leadCount?: number) => void;

// Tự động tạo hồ sơ khách hàng mới trong danh bạ CRM
addCustomer: (customer: Omit<Customer, 'id' | 'code' | 'createdAt'>) => void;
```

---

## 3. Các Thuật Toán Phân Bổ Lead Tự Động (Smart Lead Routing Algorithms)

Hệ thống hỗ trợ 3 thuật toán chia Lead linh hoạt, có thể cấu hình thông qua **Modal Cấu Hình Smart Lead Routing**:

### 3.1 Thuật Toán 1: Ưu Tiên Top Seller (Weighted Distribution - 50/30/20)
* **Ý nghĩa nghiệp vụ**: Tối đa hóa tỷ lệ chốt cọc bằng cách ưu tiên trao cơ hội cho những chiến binh bán hàng xuất sắc nhất.
* **Cơ chế trọng số**:
  * **Top 3 Seller (Hạng A - Doanh số > 50 Tỷ)**: Nhận **50%** tổng lượng Lead nóng đổ về.
  * **Chuyên viên Senior (Hạng B - Đã có giao dịch quý)**: Nhận **30%** lượng Lead.
  * **Chuyên viên Junior (Hạng C - Nhân viên mới/học việc)**: Nhận **20%** lượng Lead để tích lũy kinh nghiệm và cọ xát thị trường.

### 3.2 Thuật Toán 2: Xoay Vòng Đều (Round-Robin 1:1)
* **Ý nghĩa nghiệp vụ**: Đảm bảo tính công bằng và cân bằng tải công việc trong đội ngũ kinh doanh.
* **Cơ chế**: Lập danh sách chuyên viên đang có trạng thái `Online` và sẵn sàng nhận cuộc gọi. Mỗi khi một Lead mới xuất hiện, con trỏ sẽ phân bổ lần lượt $Agent_1 \to Agent_2 \to Agent_3 \to \dots \to Agent_n \to Agent_1$.

### 3.3 Thuật Toán 3: Phân Bổ Theo Chứng Chỉ Dự Án (Project Specialist Match)
* **Ý nghĩa nghiệp vụ**: Tránh trường hợp chuyên viên chuyên bán căn hộ Quận 1 lại được phân bổ tư vấn biệt thự biển Phan Thiết.
* **Cơ chế**: Dựa vào `projectId` gắn liền với mẫu quảng cáo, hệ thống chỉ lọc danh sách các chuyên viên đã được cấp chứng chỉ đào tạo chuyên sâu về dự án đó để giao Lead.

### 3.4 Quy Tắc Kiểm Soát SLA Phản Hồi 15 Phút & Tự Động Điều Chuyển (Auto Re-assign)
* Khi Lead đổ về, hệ thống gán nhãn `status = 'Mới'` và kích hoạt bộ đếm thời gian:
  $$\text{SLA Deadline} = \text{Thời Điểm Đổ Về} + 15\text{ Phút}$$
* **Hành vi kiểm soát**:
  * **Từ phút 0 đến phút 10**: Huy hiệu xanh hiển thị số phút còn lại.
  * **Từ phút 11 đến phút 15**: Huy hiệu đổi sang màu cam vàng nhấp nháy cảnh báo nguy cấp.
  * **Sau phút 15**: Nếu chuyên viên chưa bấm nút "Gọi Điện" hoặc chưa cập nhật trạng thái, hệ thống kích hoạt cơ chế **Auto Re-assign**: tự động thu hồi quyền chăm sóc của sale cũ và đẩy Lead sang cho sale kế tiếp có điểm sẵn sàng cao nhất, đồng thời ghi log kiểm toán.

---

## 4. Phễu Chuyển Đổi Tiếp Thị Đa Tầng (End-to-End Funnel)

Hệ thống trực quan hóa toàn bộ dòng chảy chuyển đổi qua 6 giai đoạn đo lường:

```
[ Giai Đoạn 1: Lượt Hiển Thị Quảng Cáo (Impressions) ] - 145.000 Lượt (100%)
                        |
                        v (CTR = 9.06%)
[ Giai Đoạn 2: Lượt Nhấp Vào Liên Kết (Clicks) ] - 13.150 Clicks
                        |
                        v (CVR Landing Page = 3.82%)
[ Giai Đoạn 3: Khách Điền Form (Leads Form) ] - 503 Leads
                        |
                        v (Qualification Rate = 36.9%)
[ Giai Đoạn 4: Khách Hàng Tiềm Năng Xác Thực (Qualified Leads) ] - 186 Khách
                        |
                        v (Booking Rate = 22.5%)
[ Giai Đoạn 5: Đặt Chỗ Thiện Chí (Booking Tickets) ] - 42 Booking
                        |
                        v (Closing Rate = 42.8%)
[ Giai Đoạn 6: Ký Hợp Đồng Cọc / HĐMB (Contracts Signed) ] - 18 Giao Dịch
```

### Các Công Thức Đo Lường Hiệu Suất Trọng Điểm:
1. **Chi phí trên một Lead (Cost Per Lead - CPL)**:
   $$\text{CPL} = \frac{\text{Tổng Ngân Sách Đã Tiêu}}{\text{Tổng Số Leads Thu Về}} = \frac{56.700.000\text{ VNĐ}}{503\text{ Leads}} \approx 112.723\text{ VNĐ/Lead}$$
2. **Chi phí trên một giao dịch thành công (Cost Per Acquisition - CPA)**:
   $$\text{CPA} = \frac{56.700.000\text{ VNĐ}}{18\text{ HĐMB}} \approx 3.150.000\text{ VNĐ/HĐMB}$$
   *(So với hoa hồng trung bình 300 - 500 triệu/căn, tỷ lệ chi phí tiếp thị chỉ chiếm dưới 1% giá trị giao dịch).*
3. **Hiệu suất sinh lời trên chi phí quảng cáo (ROAS - Return on Ad Spend)**:
   $$\text{ROAS} = \frac{\text{Doanh Thu Bán Hàng Quy Đổi (248.5 Tỷ)}}{\text{Tổng Chi Phí Ads (56.7 Triệu)}} \approx 4.382\times$$

---

## 5. Bộ Công Cụ Kỹ Thuật Số (Tracking, Pixels & Landing Pages)

### 5.1 Trình Tạo Liên Kết UTM Động (Live Dynamic UTM Builder)
Cho phép đội ngũ Marketing và Môi giới tự sinh các liên kết chuẩn SEO và theo dõi nguồn traffic:
$$\text{URL Hoàn Chỉnh} = \text{URL Đích} + \text{?utm\_source} + \text{\&utm\_medium} + \text{\&utm\_campaign} + \text{\&utm\_content}$$
* Tích hợp nút **Sao Chép 1-Click** có phản hồi trực quan.
* Tự động đồng bộ với mã QR Code vector độ nét cao phục vụ in ấn standee và brochure giấy.

### 5.2 Hub Quản Lý Tracking Pixels & Server-side CAPI
* **Meta Pixel ID (Facebook)**: Tích hợp mã định danh pixel kèm xác thực qua Conversion API (CAPI) chống thất thoát dữ liệu do chính sách bảo mật iOS 14.5+.
* **Google Tag Manager (GTM)**: Đồng bộ mã vùng chứa hỗ trợ theo dõi lượt submit form và Enhanced Conversions.
* **TikTok Pixel Events API**: Theo dõi hành vi người xem video review bất động sản.
* **Zalo Mini App & ZNS Webhook**: Tiếp nhận lead trực tiếp khi người dùng bấm nút quan tâm trên Zalo Official Account.
* Nút **Ping Test**: Đo độ trễ phản hồi máy chủ (Latency từ 29ms - 45ms) đảm bảo kết nối luôn thông suốt 24/7.

### 5.3 Thư Viện Landing Page & Mobile Preview
* Cung cấp 4 mẫu thiết kế landing page chuyên biệt cho 4 siêu dự án:
  1. *The Grand Manhattan*: Định vị căn hộ hạng sang trung tâm Quận 1.
  2. *Aqua City*: Đô thị sinh thái thông minh Đảo Phượng Hoàng.
  3. *NovaWorld Phan Thiết*: Biệt thự biển và tổ hợp sân golf PGA.
  4. *The Global City*: Khu nhà phố thương mại và downtown mới.
* **Khung xem trước iPhone 16 Pro**: Tích hợp Dynamic Island, nút kêu gọi hành động (CTA) nổi bật và form thu thập thông tin khách hàng nhanh.

---

## 6. Quy Trình Vận Hành Tiêu Chuẩn Cho Đội Ngũ (SOP)

```
[ Khách Điền Form Trên Facebook / Google ]
                   |
                   v (Độ trễ < 2 giây)
[ Webhook Đổ Lead Vào Bảng Sổ Leads Nóng (/marketing) ]
                   |
                   v
[ Smart Routing Engine Tự Động Phân Bổ Cho Sale ]
                   |
                   +---> Bắn Thông Báo Push Toast & SMS Đến Ứng Dụng Di Động
                   |
                   v
[ Kích Hoạt Đồng Hồ Đếm Ngược SLA 15 Phút ]
                   |
         +---------+---------+
         |                   |
         v                   v
[ Sale Bấm "Gọi Ngay" ]    [ Sale Quá Hạn 15 Phút ]
         |                   |
         v                   v
[ Ghi Nhận Trạng Thái     [ Tự Động Thu Hồi Lead &
  "Đã Gọi" - Đạt SLA ]       Chuyển Giao Cho Sale Kế Tiếp ]
```

---

## 7. Tổng Kết & Giá Trị Mang Lại

Phân hệ **Marketing Automation & Smart Lead Routing (`/marketing`)** đã giải quyết triệt để bài toán lãng phí ngân sách truyền thông trong môi trường bất động sản cạnh tranh cao:
1. **Rút ngắn thời gian tiếp cận khách từ hàng giờ xuống dưới 5 phút**.
2. **Minh bạch hóa 100% dữ liệu chi tiêu ngân sách và hiệu quả của từng đồng vốn marketing**.
3. **Loại bỏ tình trạng "ngậm lead" hoặc bỏ quên khách hàng của đội ngũ môi giới**.
4. **Cầu nối hoàn hảo giữa tiếp thị số (Digital Ads) và hệ thống vận hành thực địa (Sales Operation)**.
