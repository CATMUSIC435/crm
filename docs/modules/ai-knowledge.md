# Phân Hệ Trợ Lý AI Chuyên Sâu BĐS & Kho Tri Thức RAG - Module `/ai-knowledge`

## 1. Tổng Quan & Tầm Nhìn Kiến Trúc PropTech AI

Phân hệ **Trợ Lý AI Chuyên Sâu BĐS (`/ai-knowledge`)** là giải pháp ứng dụng công nghệ **RAG (Retrieval-Augmented Generation)** tiên tiến, được thiết kế chuyên biệt cho thị trường bất động sản cao cấp. Trong bối cảnh các đại dự án có hàng chục phụ lục chính sách bán hàng (CSBH), biểu mẫu pháp lý 1/500, tiến độ thi công và bảng tính lãi suất ngân hàng thay đổi liên tục, chuyên viên tư vấn thường gặp khó khăn trong việc cập nhật thông tin chuẩn xác.

* **Nguyên tắc "Anti-Hallucination" (Không bịa đặt số liệu)**: 100% câu trả lời của trợ lý AI đều được neo chặt vào các văn bản chính thức của Chủ đầu tư (Novaland, Masterise Homes, Vingroup), có trích dẫn số trang và điều khoản cụ thể.
* **Tự động hóa tính toán bài toán tài chính phức tạp**: Tính toán tức thì phương án đòn bẩy ngân hàng (Vốn 30%, Vay 70%, Hỗ trợ lãi suất 0% và ân hạn nợ gốc 24 tháng) cho từng mức giá căn hộ.
* **So sánh dự án đa chiều**: Phân tích định vị sản phẩm, mức giá trên mỗi m², tiện ích nội khu và tiềm năng tăng giá giữa các dự án đối thủ cạnh tranh trên cùng phân khúc.
* **Cầu nối giao dịch tức thì**: Cho phép sao chép câu trả lời để gửi qua Zalo VIP cho khách hàng hoặc xuất ra **Biên Bản Tư Vấn Khách Hàng (PDF)** có mộc đỏ và chữ ký số.

```
+-----------------------------------------------------------------------------------+
|               TRỢ LÝ AI CHUYÊN SÂU BĐS & KHO TRI THỨC RAG (/ai-knowledge)         |
+-----------------------------------------------------------------------------------+
                                          |
          +-------------------------------+-------------------------------+
          |                               |                               |
          v                               v                               v
+-------------------+           +-------------------+           +-------------------+
|  KHO TRI THỨC     |           | ĐỘNG CƠ RAG & NLP |           | CÔNG CỤ TÁC NGHIỆP|
| (Knowledge Base)  |           | (Hybrid Retriever)|           | & XUẤT BÁO CÁO    |
+-------------------+           +-------------------+           +-------------------+
| - CSBH & Bảng giá |           | - Semantic Search |           | - Gửi nhanh Zalo  |
| - Quy hoạch 1/500 |           | - Vector Chunks   |           | - Tra cứu trích   |
| - Luật Kinh doanh |           | - Tính dòng tiền  |           |   dẫn (Citation)  |
| - FAQ Môi giới    |           | - So sánh dự án   |           | - Xuất Memo PDF   |
+-------------------+           +-------------------+           +-------------------+
```

---

## 2. Kiến Trúc Kỹ Thuật RAG (Retrieval-Augmented Generation)

### 2.1 Thành Phần Module & Luồng Dữ Liệu
* **Giao diện điều khiển**: [`app/(dashboard)/ai-knowledge/page.tsx`](file:///c:/Users/catmu/Downloads/crm/app/(dashboard)/ai-knowledge/page.tsx)
  * 4 Thẻ KPI: *12.450 Chunks Vectorized, 98.6% Độ Tin Cậy, 100% Trích Dẫn Nguồn, < 1.2s Tốc Độ Phản Hồi*.
  * Cột trái: Quản lý danh mục tài liệu tri thức (Lọc theo dự án, loại tài liệu, tìm kiếm từ khóa, trạng thái học dữ liệu).
  * Cột phải: Khung chat AI Copilot với các Quick Prompt Chips, bộ hiển thị Markdown đa định dạng (bảng, danh sách), và khối trích dẫn nguồn.
  * 3 Modal nghiệp vụ: Nạp tài liệu mới (Vectorize), Tra cứu chi tiết tài liệu nguồn (Citation Inspector), và Xuất biên bản tư vấn khách hàng (PDF Memo).
* **Quản trị trạng thái**: [`store/useStore.ts`](file:///c:/Users/catmu/Downloads/crm/store/useStore.ts)
  * `knowledgeFiles`: Mảng tài liệu gồm tên, dung lượng, phân loại (`policy`, `brochure`, `price`, `law`, `faq`, `planning`), và trạng thái (`learned`, `learning`, `error`).
  * `aiChatHistory`: Lịch sử đối thoại có gắn nhãn vai trò (`user` / `ai`), nội dung, mốc thời gian và mảng tài liệu trích dẫn (`citations`).

### 2.2 Quy Trình Xử Lý Một Truy Vấn RAG
```
[User nhập câu hỏi: "So sánh chính sách thanh toán Aqua City và The Global City"]
                                    |
                                    v
                     [1. Embedding & Query Expansion]
          Tạo vector biểu diễn ngữ nghĩa của câu hỏi người dùng
                                    |
                                    v
                [2. Hybrid Retrieval (Vector + Keyword)]
       Quét qua 12.450 chunks trong Vector DB & đối chiếu từ khóa
                                    |
                                    v
                  [3. Context Reranking & Top Chunks]
     Trích xuất Top 3 đoạn văn có Cosine Similarity cao nhất (> 0.85)
     - Chinh_Sach_Ban_Hang_Aqua_T7.pdf (Trang 8-12)
     - Brochure_TheGlobalCity_Masterise.pdf (Trang 18-20)
                                    |
                                    v
                   [4. LLM Generation with Grounding]
     Mô hình tổng hợp bảng so sánh chi tiết, định dạng Markdown bảng
     Kèm theo nút xem trích dẫn nguồn gốc và nút sao chép gửi Zalo
```

---

## 3. Bộ Tri Thức Dự Án Mẫu & Năng Lực Trả Lời Chuyên Sâu

Hệ thống được nạp sẵn bộ tri thức thực tế của 5 đại dự án hàng đầu:

### 3.1 Bảng So Sánh Đa Chiều Giữa Các Dự Án
Khi người dùng truy vấn: *"So sánh chính sách thanh toán Aqua City và The Global City"*:
* Trợ lý AI tự động trích xuất và hiển thị bảng đối chiếu 3 cột:
  * **Loại hình chủ đạo**: Đô thị sinh thái ven sông vs Downtown thương mại sầm uất.
  * **Mặt bằng giá**: 65 - 90 Tr/m² vs 120 - 180 Tr/m².
  * **Tiến độ thanh toán**: Đợt 1 chỉ 10% kéo dài 3 - 5 năm vs 2 - 3 năm.
  * **Ngân hàng cho vay**: MB/VPBank ân hạn 24 tháng vs Techcombank/VietinBank ân hạn 24 tháng.
  * **Chiết khấu tối đa**: 14% + 300Tr quà tặng vs 10% thanh toán nhanh.
  * **Khuyến nghị đầu tư**: Đưa ra lời khuyên cá nhân hóa theo khẩu vị của khách mua ở hay khách đầu tư khai thác thương mại.

### 3.2 Lập Bảng Tính Dòng Tiền Vay Ngân Hàng Mẫu (Căn Shophouse 12 Tỷ)
Khi người dùng hỏi: *"Tính dòng tiền vay ngân hàng cho căn Shophouse 12 tỷ"*:
* **Vốn tự có (30%)**: 3.600.000.000 VNĐ (Chia 3 đợt thanh toán nhẹ nhàng).
* **Ngân hàng giải ngân (70%)**: 8.400.000.000 VNĐ (Thời hạn 25 năm).
* **Ưu đãi 24 tháng đầu**: Lãi suất 0%, ân hạn nợ gốc toàn phần, miễn phí trả nợ trước hạn.
* **Dòng tiền sau ưu đãi (từ năm thứ 3)**: Lãi suất 9.5%/năm, gốc ~28 Tr/tháng, lãi ~66.5 Tr/tháng. Tổng số tiền chi trả ~94.5 Tr/tháng (giảm dần). Đối trừ dòng tiền cho thuê 45 - 55 Tr/tháng, khách chỉ cần tích lũy thêm ~40 Tr/tháng.

### 3.3 Thẩm Định Pháp Lý 1/500 & Sổ Hồng Lâu Dài (The Grand Manhattan)
Khi hỏi: *"Căn hộ Grand Manhattan có được cấp sổ hồng sở hữu lâu dài không?"*:
* Khẳng định: Người Việt Nam được **sở hữu lâu dài (Sổ hồng vĩnh viễn)**, người nước ngoài sở hữu 50 năm theo Luật Nhà ở.
* Dẫn chứng số liệu: Quyết định 1/500 số **4125/QĐ-UBND**, Giấy phép xây dựng số **08/GPXD**, Văn bản đủ điều kiện bán hàng số **1254/SXD-QLN**.

### 3.4 Phân Tích Tiềm Năng Tăng Giá (NovaWorld Phan Thiết)
Khi hỏi: *"Phân tích tiềm năng tăng giá NovaWorld Phan Thiết khi cao tốc Dầu Giây thông xe"*:
* Đòn bẩy hạ tầng: Rút ngắn thời gian di chuyển từ TP.HCM còn **1 giờ 45 phút**.
* Hiệu suất khai thác: Bikini Beach đón 15.000 - 25.000 lượt khách/cuối tuần, sân golf PGA 36 hố độc quyền.
* Tỷ suất sinh lời: Lợi nhuận vốn kỳ vọng **+18 - 25%/năm**, tỷ suất cho thuê biệt thự biển **8.5 - 11%/năm**.

### 3.5 Bóc Tách Chiết Khấu Thanh Toán Sớm 95%
* Giảm trực tiếp **12%** vào giá bán.
* Tặng thêm **2%** Early Bird trong tháng.
* Thẻ thành viên VIP tặng thêm **1% - 3%**.
* Trừ thẳng **300.000.000 VNĐ** quà tặng nội thất.
* Căn 10 tỷ được giảm tới **1.4 tỷ VNĐ**, giá thực trả chỉ còn **8.3 tỷ VNĐ**.

---

## 4. Hệ Thống Công Cụ Tác Nghiệp Thương Mại (Zero Dead Buttons)

| Công Cụ | Cơ Chế Hoạt Động & Giá Trị Nghiệp Vụ |
| :--- | :--- |
| **Sao Chép 1-Click** | Nút `Sao chép` trên từng tin nhắn AI lưu toàn bộ văn bản vào Clipboard để môi giới paste nhanh vào đoạn chat với khách hàng. |
| **Gửi Zalo VIP** | Nút `Gửi Zalo` chuẩn bị nội dung rút gọn định dạng đẹp, gửi thẳng sang ứng dụng Zalo của khách hàng tiềm năng. |
| **Tra Cứu Trích Dẫn (Citation Inspector)** | Click vào bất kỳ huy hiệu trích dẫn nào để mở Modal xem đoạn văn bản gốc, số trang chính xác và độ tương đồng Cosine Similarity. |
| **Nạp Tài Liệu Tri Thức Mới** | Modal cho phép chọn loại tài liệu (CSBH, Bảng giá, 1/500), gắn với dự án và tự động mô phỏng quá trình bóc tách vector chunks (`learning` ➔ `learned`). |
| **Xuất Biên Bản Tư Vấn (PDF Memo)** | Chọn tên khách hàng VVIP trong CRM, xuất bản file Báo cáo tư vấn PDF có tiêu ngữ, chữ ký số chuyên viên và mộc công ty. |

---

## 5. Hướng Dẫn Tác Nghiệp Chuẩn (SOP) Dành Cho Chuyên Viên

```
[BƯỚC 1: Tiếp nhận băn khoăn của khách hàng]
  -> Khách hàng hỏi qua điện thoại/Zalo về chính sách chiết khấu, tiến độ thanh toán hoặc rủi ro pháp lý.

[BƯỚC 2: Truy vấn tức thì trên NovaCopilot]
  -> Gõ câu hỏi hoặc bấm các nút Prompt gợi ý nhanh.
  -> AI đối soát văn bản CĐT và trả lời sau 1.2 giây kèm số liệu cụ thể.

[BƯỚC 3: Kiểm chứng trích dẫn nguồn]
  -> Bấm vào huy hiệu nguồn (VD: Chinh_Sach_Ban_Hang_Aqua_T7.pdf) để kiểm tra số trang và điều khoản gốc.

[BƯỚC 4: Chuyển giao thông tin đến khách hàng]
  -> Bấm "Sao chép" hoặc "Gửi Zalo" để gửi câu trả lời đã được định dạng rõ ràng, chuyên nghiệp.
  -> Hoặc bấm "Xuất Biên Bản Tư Vấn" tải file PDF gửi kèm email cho nhà đầu tư VVIP.
```

---

## 6. Tiêu Chuẩn Kỹ Thuật & Bảo Mật

* **Bảo mật dữ liệu (Data Privacy)**: Không gửi dữ liệu nội bộ của công ty lên các dịch vụ công cộng không được ủy quyền; dữ liệu được cô lập trong môi trường doanh nghiệp.
* **Định dạng chuẩn Markdown**: Hỗ trợ bảng kẻ ô 3-4 cột, danh sách có bullet, in đậm số liệu tài chính rõ ràng.
* **Khả năng mở rộng**: Dễ dàng tích hợp các Vector DB chuẩn doanh nghiệp như PostgreSQL với `pgvector`, Qdrant, Pinecone hoặc Milvus.
