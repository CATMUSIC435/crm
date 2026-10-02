# Phân Hệ Bảng Tính Lãi Vay & Dòng Tiền Đầu Tư Bất Động Sản - Module `/mortgage`

## 1. Tổng Quan & Tầm Nhìn Chiến Lược Mortgage Engineering Trong BĐS Cao Cấp

Trong thị trường bất động sản phân khúc trung - cao cấp và hạng sang (The Grand Manhattan, Aqua City, The Global City, Vinhomes Grand Park, Masterise Homes...), quyết định xuống tiền đặt cọc của khách hàng cá nhân và nhà đầu tư **không chỉ dựa vào vẻ đẹp kiến trúc hay vị trí**, mà phụ thuộc **hơn 80% vào giải pháp kỹ thuật tài chính (Financial Engineering)**.

Một căn biệt thự 18.5 Tỷ VNĐ hoặc căn hộ 7.5 Tỷ VNĐ là một khoản vốn rất lớn. Tuy nhiên, khi chuyên viên tư vấn biết cách cấu trúc đòn bẩy tài chính thông qua chính sách liên kết ngân hàng của Chủ Đầu Tư (CĐT), bài toán sẽ hoàn toàn thay đổi:
1. **Đòn bẩy 0% Lãi Suất (Developer Subsidized Scheme)**: Khách hàng chỉ cần bỏ ra $20\% - 30\%$ vốn tự có ban đầu. Trong 18 đến 24 tháng đầu tiên (cho đến khi nhận nhà), ngân hàng giải ngân $70\% - 80\%$ nhưng CĐT chi trả toàn bộ lãi suất ($0\%$ LS) và ân hạn nợ gốc (không phải trả một đồng gốc nào).
2. **Khai thác dòng tiền kép (Cash Flow Arbitrage)**: Khi nhận nhà, tài sản bắt đầu cho thuê đem lại dòng tiền ròng $2.5\% - 4.5\%$/năm. Dòng tiền này được dùng để bù đắp phần lớn tiền gốc và lãi ngân hàng từ năm thứ 3 trở đi.
3. **Hiệu ứng gia tăng giá trị vốn (Capital Appreciation)**: Với tỷ lệ tăng giá đất và đô thị hóa trung bình $+12\% \rightarrow +18\%$/năm, trên quy mô tổng giá trị tài sản 100%, tỷ suất hoàn vốn trên vốn tự có thực bỏ ra (ROE - Return on Equity) có thể đạt từ **$+35\%$ đến $+55\%$/năm**.

Phân hệ **Bảng Tính Lãi Vay & Dòng Tiền Đầu Tư BĐS (`/mortgage`)** được xây dựng như một công cụ bán hàng sát thủ (Sales Closing Weapon) dành cho chuyên viên kinh doanh, tích hợp trực tiếp rổ hàng tồn kho theo thời gian thực, bảng tính khấu hao 360 tháng, kiểm tra an toàn thu nhập DTI, mô phỏng phí phạt tất toán sớm và xuất báo cáo Zalo/PDF chuyên nghiệp trong 1-chạm.

```
+-----------------------------------------------------------------------------------+
|               BẢNG TÍNH LÃI VAY & DÒNG TIỀN ĐẦU TƯ NOVA MORTGAGE (/mortgage)      |
+-----------------------------------------------------------------------------------+
                                          |
          +-------------------------------+-------------------------------+
          |                               |                               |
          v                               v                               v
+-------------------+           +-------------------+           +-------------------+
| RỔ HÀNG REALTIME  |           | KHẤU HAO 360 THÁNG|           | ĐÒN BẨY & CHO THUÊ|
| & 4 NGÂN HÀNG     |           | & TẤT TOÁN SỚM    |           | RENTAL YIELD & ROI|
+-------------------+           +-------------------+           +-------------------+
| - Căn hộ/Biệt thự |           | - Dư nợ giảm dần  |           | - Giá thuê ròng   |
| - Đồng bộ giá bán |           | - Niên kim (PMT)  |           | - DTI < 40% an toàn|
| - MBB, VPB, TCB.. |           | - Ân hạn gốc CĐT  |           | - ROI +20.2%/Năm  |
| - Ưu đãi 0% LS    |           | - Phí phạt tất toán|           | - Hoàn vốn tích sản|
+-------------------+           +-------------------+           +-------------------+
```

---

## 2. Cấu Trúc Kỹ Thuật & Luồng Dữ Liệu (Technical Architecture)

### 2.1 File Components & Đường Dẫn Mã Nguồn
* **Giao diện bảng tính trung tâm**: [`app/(dashboard)/mortgage/page.tsx`](file:///c:/Users/catmu/Downloads/crm/app/(dashboard)/mortgage/page.tsx)
* **Tài liệu kỹ thuật module**: [`docs/modules/mortgage.md`](file:///c:/Users/catmu/Downloads/crm/docs/modules/mortgage.md)
* **Kho lưu trữ trạng thái toàn cục**: [`store/useStore.ts`](file:///c:/Users/catmu/Downloads/crm/store/useStore.ts)
* **Khai báo kiểu dữ liệu TypeScript**: [`types/index.ts`](file:///c:/Users/catmu/Downloads/crm/types/index.ts)

### 2.2 Mô Hình Dữ Liệu Thực Thể (Data Models)

#### Entity `PartnerBank` (Ngân Hàng Đối Tác Chiến Lược)
```typescript
interface PartnerBank {
  id: string;                   // Mã định danh ngân hàng ('mbb', 'vpb', 'tcb', 'vcb')
  name: string;                 // Tên pháp nhân đầy đủ
  shortName: string;            // Tên viết tắt giao dịch (VD: 'MBBank', 'VPBank')
  logo: string;                 // Chữ viết tắt hiển thị logo ('MB', 'TCB'...)
  badgeColor: string;           // Màu sắc nhận diện thương hiệu
  promoRate: number;            // Lãi suất ưu đãi (%/năm, VD: 0.0% hoặc 6.5%)
  postPromoRate: number;        // Lãi suất thả nổi sau ưu đãi (%/năm, VD: 9.2%)
  promoPeriodMonths: number;    // Thời hạn ưu đãi lãi suất (Tháng, VD: 24 tháng)
  maxLoanPercent: number;       // Tỷ lệ cho vay tối đa (% giá trị HĐMB, VD: 75% - 80%)
  maxTermYears: number;         // Thời hạn vay tối đa (Năm, VD: 25 - 30 năm)
  gracePeriodMonths: number;    // Thời gian ân hạn nợ gốc của CĐT (Tháng, VD: 24 tháng)
  prepaymentPenalty: string;    // Quy tắc tính phí phạt tất toán trước hạn
  appraisalTimeHours: number;   // Thời gian cam kết phê duyệt tín dụng (Giờ)
  features: string[];           // Danh sách đặc quyền ưu đãi nổi bật
  description: string;          // Ghi chú nghiệp vụ thẩm định
}
```

#### Entity `MortgageSimulation` (Phương Án Tài Chính Đã Lưu)
```typescript
export interface MortgageSimulation {
  id: string;                                   // Mã phương án (VD: 'SIM-001')
  customerId?: string;                          // ID khách hàng nhận phương án
  customerName?: string;                        // Tên khách hàng
  propertyCode?: string;                        // Mã căn hộ/sản phẩm (VD: 'AQC-PH-102')
  propertyValue: number;                        // Tổng giá trị BĐS (VNĐ)
  loanPercent: number;                          // Tỷ lệ vay vốn (%)
  loanAmount: number;                           // Số tiền vay ngân hàng (VNĐ)
  loanTermYears: number;                        // Thời hạn vay (Năm)
  bankId: string;                               // Mã ngân hàng lựa chọn
  bankName: string;                             // Tên ngân hàng
  repaymentMethod: 'reducing' | 'linear';       // Phương thức: Dư nợ giảm dần | Niên kim cố định
  enableGracePeriod: boolean;                   // Có áp dụng ân hạn gốc/lãi CĐT hay không
  graceMonths: number;                          // Số tháng ân hạn thực tế
  monthlyIncome: number;                        // Thu nhập hàng tháng của khách hàng
  dtiRatio: number;                             // Chỉ số DTI (%)
  totalInterest: number;                        // Tổng tiền lãi phải trả toàn chu kỳ (VNĐ)
  firstMonthlyPayment: number;                  // Số tiền trả hàng tháng cao nhất sau ân hạn (VNĐ)
  createdAt: string;                            // Ngày tạo phương án
}
```

---

## 3. Mô Hình Toán Học & Công Thức Tài Chính Ngân Hàng (Financial Formulas)

### 3.1 Phương Pháp 1: Dư Nợ Giảm Dần (Reducing Balance Method)
Đây là phương thức trả nợ phổ biến nhất tại các ngân hàng thương mại Việt Nam. Gốc được chia đều cho các tháng sau khi hết thời gian ân hạn; tiền lãi tính trên dư nợ gốc thực tế còn lại tại đầu mỗi kỳ:

* **Tiền gốc trả hàng tháng** ($P_m$):
$$\text{Với } m \le G \text{ (tháng ân hạn)}: \quad P_m = 0$$
$$\text{Với } m > G: \quad P_m = \frac{L}{N - G}$$
*(Trong đó: $L$ là số tiền vay, $N$ là tổng số tháng vay $N = \text{TermYears} \times 12$, $G$ là số tháng ân hạn gốc).*

* **Tiền lãi trả hàng tháng** ($I_m$):
$$I_m = R_{m-1} \times \frac{r_m}{12}$$
*(Trong đó: $R_{m-1}$ là dư nợ gốc còn lại của kỳ trước, $r_m$ là lãi suất năm hiệu lực tại tháng $m$ ($0\%$ trong kỳ ưu đãi, sau đó là lãi thả nổi $r_{\text{post}}$)).*

* **Tổng số tiền phải trả tháng** $m$ ($Total_m$):
$$Total_m = P_m + I_m$$

* **Dư nợ gốc còn lại cuối tháng** $m$ ($R_m$):
$$R_m = R_{m-1} - P_m$$

---

### 3.2 Phương Pháp 2: Niên Kim Cố Định (Equal Monthly Installment - PMT)
Áp dụng cho các khách hàng có thu nhập ổn định cố định muốn trả một số tiền cố định mỗi tháng:

$$PMT = L \times \frac{\frac{r}{12} \times \left(1 + \frac{r}{12}\right)^{N - G}}{\left(1 + \frac{r}{12}\right)^{N - G} - 1}$$

* Hàng tháng:
  * $I_m = R_{m-1} \times \frac{r}{12}$
  * $P_m = PMT - I_m$
  * $Total_m = PMT$

---

### 3.3 Chỉ Số Nợ Trên Thu Nhập (Debt-to-Income Ratio - DTI)
DTI là chỉ số đo lường mức độ an toàn tài chính và khả năng trả nợ của khách hàng, được tính dựa trên tháng có nghĩa vụ thanh toán cao nhất (tháng đầu tiên ngay sau khi kết thúc ân hạn nợ gốc):

$$DTI = \frac{\text{Tổng trả hàng tháng cao nhất } (Total_{\text{peak}})}{\text{Thu nhập ròng hàng tháng của khách hàng } (\text{Income})} \times 100\%$$

* **Đánh giá xếp hạng rủi ro tín dụng**:
  * $DTI \le 35\%$: **Hạng A (Cực kỳ an toàn)** - Ngân hàng duyệt hồ sơ tự động trong 4 giờ.
  * $35\% < DTI \le 50\%$: **Hạng B (An toàn)** - Cần chứng minh thêm nguồn thu phụ hoặc bất động sản sở hữu.
  * $DTI > 50\%$: **Hạng C (Cảnh báo rủi ro)** - Sales cần tư vấn tăng thời hạn vay (kéo dài lên 25–30 năm) hoặc tăng vốn tự có để giảm áp lực dòng tiền.

---

### 3.4 Tỷ Suất Cho Thuê Ròng (Net Rental Yield) & Tỷ Suất Lợi Nhuận Tổng (Total ROI)
Mô hình ước tính dòng tiền cho thuê khai thác và tích sản:

$$\text{Doanh Thu Thuê Ròng Hàng Năm } (\text{Net Rental}) = \left(\text{Giá thuê tháng} \times 12 \times \frac{\text{Tỷ lệ lấp đầy}}{100}\right) \times (1 - \text{Chi phí vận hành } 10\%)$$

$$\text{Tỷ Suất Cho Thuê Ròng } (\text{Net Rental Yield}) = \frac{\text{Net Rental}}{\text{Giá trị BĐS}} \times 100\%$$

$$\text{Tổng Tỷ Suất Sinh Lời Hàng Năm } (\text{Total Annual Return}) = \text{Net Rental Yield} + \text{Tốc độ tăng giá vốn dự kiến } (\%/\text{Năm})$$

$$\text{Thời Gian Hoàn Vốn Tích Sản } (\text{Payback Period}) = \frac{\text{Giá trị BĐS}}{\text{Net Rental} + \left(\text{Giá trị BĐS} \times \frac{\text{Tăng giá}}{100}\right)} \text{ (Năm)}$$

---

### 3.5 Công Thức Mô Phỏng Trả Nợ Trước Hạn & Phí Phạt (Prepayment Simulation)
Khi khách hàng quyết định tất toán khoản vay vào năm thứ $Y$ ($Y \times 12$ tháng):
* **Dư nợ gốc còn lại**: $R_{\text{target}}$
* **Tỷ lệ phí phạt** ($penaltyRate$): Quy định theo ngân hàng (VD: Năm 1: $1.5\%$, Năm 2: $1.0\%$, Năm 3: $0.5\%$, từ Năm 4: $0.0\%$).
* **Phí phạt tất toán**:
$$\text{Phí phạt} = R_{\text{target}} \times \frac{penaltyRate}{100}$$
* **Tổng tiền cần thanh toán**:
$$\text{Tổng tất toán} = R_{\text{target}} + \text{Phí phạt}$$
* **Số tiền lãi vay tiết kiệm được**:
$$\text{Lãi tiết kiệm} = \text{Tổng lãi dự kiến cả chu kỳ} - \sum_{m=1}^{Y \times 12} I_m$$

---

## 4. Ma Trận So Sánh 4 Ngân Hàng Đối Tác Chiến Lược

CRM tích hợp sẵn thông số chính sách vay liên kết của 4 ngân hàng bảo lãnh lớn nhất:

| Tiêu Chí So Sánh | MBBank (Quân Đội) | VPBank (Thịnh Vượng) | Techcombank (Kỹ Thương) | Vietcombank (Ngoại Thương) |
| :--- | :---: | :---: | :---: | :---: |
| **Lãi suất ưu đãi CĐT** | **0.0% / Năm** | **0.0% / Năm** | **7.5% / Năm** | **6.5% / Năm** |
| **Thời gian ưu đãi** | 24 Tháng | 18 Tháng | 36 Tháng | 24 Tháng |
| **Lãi suất sau ưu đãi** | 9.2% / Năm | 8.9% / Năm | 9.5% / Năm | **8.5% / Năm (Thấp nhất)** |
| **Ân hạn nợ gốc CĐT** | **24 Tháng** | 18 Tháng | 12 Tháng | 12 Tháng |
| **Tỷ lệ vay tối đa** | 75% | **80% (Cao nhất)** | 70% | 70% |
| **Thời hạn vay tối đa** | 25 Năm | **30 Năm (Dài nhất)** | 25 Năm | 20 Năm |
| **Phí phạt trả nợ sớm** | Miễn phí sau Năm 3 | 1.0% trong 2 năm đầu | Miễn phí từ Năm 4 | 0.5% trong 3 năm đầu |
| **Thời gian phê duyệt** | **4 Giờ (Siêu tốc)** | 8 Giờ | 6 Giờ | 24 Giờ |
| **Điểm mạnh tư vấn** | 0% LS & Ân hạn 24T | Vay 80%, thời hạn 30 năm | Cố định 7.5% suốt 3 năm | Thương hiệu Big 4 uy tín |

---

## 5. Hệ Thống 5 Modals Tương Tác Không Nút Chết (Zero-Dead-Button Modals)

1. **Modal 1: Bảng Khấu Hao Toàn Bộ Chu Kỳ (360 Tháng)** (`showFullAmortizationModal`):
   - Cho phép duyệt qua tất cả các tháng vay từ 1 đến 360 tháng.
   - Hộp lọc (Filter) động theo từng năm (Năm 1, Năm 2... Năm 30 hoặc Toàn bộ).
   - Nút tải trực tiếp **File Excel / CSV (UTF-8 BOM)** kèm nhãn kỳ, lãi suất, tiền gốc, lãi và dư nợ.
2. **Modal 2: Ma Trận So Sánh 4 Ngân Hàng Đối Tác** (`showBankCompareModal`):
   - So sánh trực quan bảng ma trận 8 tiêu chuẩn tín dụng.
   - Nút hành động **"Chọn Gói Này"** tương ứng từng ngân hàng: lập tức cập nhật lại toàn bộ bảng tính và biểu đồ khấu hao.
3. **Modal 3: Mô Phỏng Trả Nợ Trước Hạn & Phí Phạt** (`showPrepaymentModal`):
   - Kéo thanh trượt thời điểm tất toán từ Năm 1 đến Năm 10.
   - Tự động đối chiếu biểu phí phạt thực tế của ngân hàng đã chọn.
   - Hiển thị nổi bật số tiền **LÃI TIẾT KIỆM ĐƯỢC** (thường lên đến hàng trăm triệu hoặc hàng tỷ đồng).
4. **Modal 4: Lưu & Xuất Báo Cáo Kế Hoạch Tài Chính** (`exportModalOpen`):
   - Gắn kết phương án với khách hàng cụ thể trong CRM.
   - Thêm ghi chú tư vấn chiến lược.
   - Lưu vào danh sách `savedMortgageSimulations` của Zustand Store để tái sử dụng.
5. **Modal 5: Gửi Phương Án Vay Qua Zalo VIP 1-Chạm** (`shareModalOpen`):
   - Cung cấp 3 kịch bản tin nhắn mẫu chuyên nghiệp:
     - *Mẫu 1*: Tóm tắt nhanh phương án tài chính & ưu đãi CĐT.
     - *Mẫu 2*: Bảng tính dòng tiền cho thuê bù đắp lãi vay.
     - *Mẫu 3*: Phân tích tỷ suất hoàn vốn ROI & tích sản 5 năm.
   - Nút 1-chạm sao chép clipboard và liên kết trực tiếp mở Zalo Web.

---

## 6. Ma Trận Kịch Bản Kiểm Thử (8/8 Test Scenarios Matrix)

| Test ID | Kịch Bản Kiểm Thử | Dữ Liệu Đầu Vào | Kết Quả Mong Đợi | Trạng Thái |
| :---: | :--- | :--- | :--- | :---: |
| **TC-01** | Liên kết rổ hàng tồn kho | Chọn căn `AQC-PH-102` (14.5 Tỷ) | Giá trị tự cập nhật 14.5 Tỷ, tiền thuê gợi ý 50Tr/tháng | **PASS** |
| **TC-02** | Chuyển đổi phương thức trả nợ | Đổi giữa Dư nợ giảm dần vs PMT | Bảng khấu hao và biểu đồ tính lại tức thì | **PASS** |
| **TC-03** | Kích hoạt ưu đãi 0% LS & Ân hạn | Bật/tắt checkbox 0% CĐT | Trong 24 tháng đầu tiền gốc = 0đ, lãi = 0đ | **PASS** |
| **TC-04** | Đổi ngân hàng đối tác | Chọn MBBank $\rightarrow$ Vietcombank | Cập nhật lãi ưu đãi 6.5%, thả nổi 8.5%, tối đa 20 năm | **PASS** |
| **TC-05** | Mô phỏng trả nợ trước hạn | Chọn tất toán sau 3 năm khoản vay 12 Tỷ | Tính chính xác phí phạt 0.5% và số lãi tiết kiệm | **PASS** |
| **TC-06** | Xuất file CSV bảng khấu hao | Nhấp "Tải File CSV" | File tải về có mã `\uFEFF`, mở Excel không lỗi font | **PASS** |
| **TC-07** | Lưu & Áp dụng lại phương án | Lưu hồ sơ cho khách Nguyễn Văn A | Xuất hiện ở tab "Hồ Sơ Đã Lưu", bấm áp dụng lại thành công | **PASS** |
| **TC-08** | Sao chép phương án Zalo VIP | Chọn mẫu "Dòng Tiền Bù Lãi" & Copy | Đưa nội dung chuẩn markdown vào clipboard | **PASS** |

---

## 7. Cẩm Nang Thực Chiến Dành Cho Chuyên Viên Bất Động Sản (Agent Operational Playbook)

### Kịch bản 1: Tư vấn Khách hàng Mua Để Ở (End-User) - Tập trung vào sự An Tâm & Nhẹ Nhàng Dòng Tiền
* **Tâm lý khách**: Lo lắng lãi suất thả nổi tăng cao sau thời gian ưu đãi.
* **Chiến thuật đòn bẩy**:
  1. Chọn **MBBank** hoặc **VPBank** với thời hạn tối đa 25–30 năm để chia nhỏ tiền gốc hàng tháng.
  2. Bật tính năng **DTI Ratio**: Chỉ cho khách thấy rằng với thu nhập 180 Triệu/tháng, số tiền trả sau ân hạn chỉ chiếm $\approx 22\%$ thu nhập ròng, hoàn toàn nằm trong vùng an toàn tuyệt đối ($< 40\%$).
  3. Sử dụng **Modal Trả Nợ Trước Hạn**: Chỉ ra rằng sau 3 năm, khi khách tích lũy được thưởng cuối năm hoặc lợi nhuận kinh doanh, việc tất toán sớm hoàn toàn được miễn phí phạt.

### Kịch bản 2: Tư vấn Nhà Đầu Tư Bất Động Sản (Investor) - Tập trung vào Đòn Bẩy Vốn & Tỷ Suất Sinh Lời (ROE)
* **Tâm lý khách**: Muốn bỏ ra ít vốn nhất có thể để sở hữu nhiều tài sản nhất (Maximize Leverage).
* **Chiến thuật đòn bẩy**:
  1. Chọn tỷ lệ vay **$70\% - 80\%$** kèm chính sách **0% Lãi suất 24 tháng**.
  2. Chuyển sang Tab **"Hiệu Quả Đầu Tư & Cho Thuê"**:
     * Trực quan hóa con số: Khách chỉ bỏ ra 5.5 Tỷ VNĐ vốn tự có để sở hữu căn hộ 18.5 Tỷ VNĐ.
     * Trong 24 tháng đầu: Giá BĐS tăng $+15\%$/năm $\rightarrow$ Giá trị căn nhà tăng $+5.5$ Tỷ VNĐ $\rightarrow$ **Tỷ suất lợi nhuận trên vốn tự có đạt $100\%$ ngay khi nhận nhà!**
  3. Xuất file PDF hoặc gửi mẫu Zalo ROI để chốt booking ngay trong sự kiện mở bán.
