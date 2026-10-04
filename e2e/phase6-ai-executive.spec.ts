import { test, expect } from '@playwright/test';

const BACKEND_URL = 'http://localhost:4000';
const FRONTEND_URL = 'http://localhost:3000';

test.describe('Giai Đoạn 6: AI & Cổng Điều Hành Đa Tầng (Modules 31–36)', () => {
  let authToken = '';

  test.beforeAll(async () => {
    // Đăng nhập tài khoản admin để lấy Bearer token kiểm thử Backend API
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@novacrm.com', password: 'password123' }),
    });
    expect(res.ok).toBeTruthy();
    const data = await res.json();
    authToken = data.data.accessToken;
    expect(authToken).toBeTruthy();
  });

  // Thiết lập Cookie xác thực phiên làm việc SUPER_ADMIN trước mỗi test case UI
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: authToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);
  });

  // =========================================================================
  // 1. MODULE 31: TRỢ LÝ TRI THỨC AI & RAG BASE (/ai-knowledge)
  // =========================================================================
  test.describe('31. Trợ Lý AI Tri Thức & RAG Base (/ai-knowledge)', () => {
    test('UI-31.1: Hiển thị Trợ Lý Tri Thức AI & RAG Base với danh mục tài liệu & tìm kiếm ngữ nghĩa', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/ai-knowledge`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Kiểm tra tiêu đề trang
      await expect(page.locator('text=Trợ Lý AI Chuyên Sâu BĐS & Kho Tri Thức RAG').first()).toBeVisible({ timeout: 10000 });

      // Kiểm tra các thẻ KPI tri thức
      await expect(page.locator('text=Vector Embeddings').first()).toBeVisible();
      await expect(page.locator('text=Độ Tin Cậy Dữ Liệu').first()).toBeVisible();

      // Kiểm tra ô tìm kiếm tài liệu
      const searchInput = page.locator('input[placeholder*="Tìm tài liệu, thông tư, CSBH..."]').first();
      await expect(searchInput).toBeVisible();
      await searchInput.fill('Chính sách');
      await page.waitForTimeout(500);
    });

    test('UI-31.2: Gửi câu hỏi nghiệp vụ động Date.now() tới Trợ lý AI và nhận câu trả lời phân tích', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/ai-knowledge`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      const dynamicQuestion = `Chính sách chiết khấu thanh toán nhanh Aqua City kiểm thử ${Date.now()}?`;
      const askInput = page.locator('input[placeholder*="Hỏi AI về chính sách chiết khấu"]').first();
      await expect(askInput).toBeVisible({ timeout: 10000 });
      await askInput.fill(dynamicQuestion);

      // Bấm nút gửi tin nhắn
      const sendBtn = page.locator('button:has(svg.lucide-send)').first();
      await sendBtn.click();

      // Kiểm tra câu hỏi xuất hiện trong luồng chat
      await expect(page.locator(`text=${dynamicQuestion}`).first()).toBeVisible({ timeout: 10000 });
    });

    test('UI-31.3: Nạp Tài Liệu Tri Thức Mới với tên động Date.now() qua Modal (z-[1000])', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/ai-knowledge`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Bấm nút "Nạp Tài Liệu Tri Thức"
      const uploadBtn = page.locator('button:has-text("Nạp Tài Liệu Tri Thức")').first();
      await expect(uploadBtn).toBeVisible({ timeout: 10000 });
      await uploadBtn.click();

      // Modal nạp tài liệu xuất hiện với z-[1000]
      const modal = page.locator('div.fixed.z-\\[1000\\]:has-text("Nạp Tài Liệu Vào Kho Tri Thức RAG")');
      await expect(modal).toBeVisible();

      // Nhập tên tài liệu động
      const dynamicDocName = `CSBH_AquaCity_Ver_${Date.now().toString().slice(-4)}.pdf`;
      const docInput = modal.locator('input[placeholder*="Chinh_Sach_Ban_Hang"]').first();
      await docInput.fill(dynamicDocName);

      // Bấm submit nạp tài liệu
      await modal.locator('button[type="submit"]:has-text("Xác Nhận & Vectorize")').click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });

      // Kiểm tra tài liệu mới xuất hiện trong danh mục
      await expect(page.locator(`text=${dynamicDocName}`).first()).toBeVisible({ timeout: 10000 });
    });

    test('UI-31.4: Mở Citation Inspector (Modal z-[1000]) kiểm tra trích xuất nguồn RAG', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/ai-knowledge`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Click vào nút trích dẫn trong tin nhắn chat
      const citationBtn = page.locator('button:has-text("CSBH_AquaCity")').or(page.locator('button:has(svg.lucide-file-text)').filter({ hasText: 'pdf' })).first();
      if (await citationBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await citationBtn.click();
        const citationModal = page.locator('div.fixed.z-\\[1000\\]:has-text("Đối chiếu trích dẫn nguồn RAG")');
        await expect(citationModal).toBeVisible();
        await expect(citationModal.locator('text=Độ tương đồng ngữ nghĩa')).toBeVisible();
        // Đóng modal
        await citationModal.locator('button:has-text("Đóng")').click();
        await expect(citationModal).not.toBeVisible({ timeout: 5000 });
      }
    });

    test('API-31.5: Backend AiKnowledge Controller trả lời câu hỏi và lấy danh mục tài liệu', async () => {
      // 1. Lấy danh mục tài liệu
      const resDocs = await fetch(`${BACKEND_URL}/api/v1/ai-knowledge/documents`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(resDocs.status).toBe(200);
      const docs = await resDocs.json();
      expect(docs.success).toBe(true);
      expect(Array.isArray(docs.data)).toBe(true);

      // 2. Hỏi đáp qua RAG ask API
      const resAsk = await fetch(`${BACKEND_URL}/api/v1/ai-knowledge/ask`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: 'Chiết khấu Aqua City đợt này là bao nhiêu?' }),
      });
      expect(resAsk.status).toBe(201);
      const answer = await resAsk.json();
      expect(answer.success).toBe(true);
      expect(answer.data).toHaveProperty('answer');
    });
  });

  // =========================================================================
  // 2. MODULE 32: AI OCR NHẬN DIỆN GIẤY TỜ (/document-ai)
  // =========================================================================
  test.describe('32. AI OCR Nhận Diện Giấy Tờ (/document-ai)', () => {
    test('UI-32.1: Hiển thị Studio OCR Nhận Diện Giấy Tờ với 4 thẻ KPI trích xuất', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/document-ai`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Kiểm tra tiêu đề trang
      await expect(page.locator('text=Nhận Diện Giấy Tờ & OCR Thông Minh').first()).toBeVisible({ timeout: 10000 });

      // Kiểm tra các thẻ KPI
      await expect(page.locator('text=Độ Chính Xác OCR').first()).toBeVisible();
      await expect(page.locator('text=Thời Gian Xử Lý').first()).toBeVisible();
    });

    test('UI-32.2: Chuyển đổi mẫu tài liệu (CCCD / Sổ hồng) bóc tách các trường dữ liệu động', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/document-ai`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Click chọn mẫu "Sổ Hồng"
      const soHongBtn = page.locator('button:has-text("Sổ Hồng")').first();
      await expect(soHongBtn).toBeVisible({ timeout: 10000 });
      await soHongBtn.click();
      await page.waitForTimeout(500);

      // Bấm nút "Bắt Đầu Quét OCR" để phân tích hình ảnh sổ hồng
      const scanBtn = page.locator('button:has-text("Bắt Đầu Quét OCR")').or(page.locator('button:has-text("Quét Ngay")')).first();
      await scanBtn.click();
      await page.waitForTimeout(2000);

      // Kiểm tra trường thửa đất hiển thị
      await expect(page.locator('text=Thửa Đất Số').first()).toBeVisible({ timeout: 5000 });

      // Chuyển lại mẫu CCCD Gắn Chip
      const cccdBtn = page.locator('button:has-text("CCCD Gắn Chip")').first();
      await cccdBtn.click();
      await page.waitForTimeout(500);

      // Quét lại CCCD
      const scanCccdBtn = page.locator('button:has-text("Bắt Đầu Quét OCR")').or(page.locator('button:has-text("Quét Ngay")')).first();
      await scanCccdBtn.click();
      await page.waitForTimeout(2000);

      await expect(page.locator('text=Số CCCD / Hộ Chiếu').first()).toBeVisible({ timeout: 5000 });
    });

    test('UI-32.3: Mở Modal Xem Trước JSON Schema RESTful API (z-[1000])', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/document-ai`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Bấm nút "Xem JSON Schema"
      const jsonBtn = page.locator('button:has-text("Xem JSON Schema")').first();
      await expect(jsonBtn).toBeVisible({ timeout: 10000 });
      await jsonBtn.click();

      // Modal JSON hiển thị z-[1000]
      const modal = page.locator('div.fixed.z-\\[1000\\]:has-text("Document AI OCR - JSON Response Payload")');
      await expect(modal).toBeVisible();

      // Đóng modal
      await modal.locator('button:has-text("Đóng")').first().click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });
    });

    test('UI-32.4: Mở Modal Tự Động Tạo Hợp Đồng Mua Bán từ kết quả OCR (z-[1000])', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/document-ai`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Kích hoạt nút Bắt Đầu Quét OCR trước để hoàn tất quy trình trích xuất
      const scanBtn = page.locator('button:has-text("Bắt Đầu Quét OCR")').or(page.locator('button:has-text("Quét Lại")')).first();
      await expect(scanBtn).toBeVisible({ timeout: 10000 });
      await scanBtn.click();

      // Chờ quét OCR xong (animation ~1.5s)
      await page.waitForTimeout(2000);

      // Bấm nút "Tạo Hợp Đồng Tự Động"
      const contractBtn = page.locator('button:has-text("Tạo Hợp Đồng Tự Động")').or(page.locator('button:has-text("Tạo Thêm HĐ")')).first();
      await expect(contractBtn).toBeVisible({ timeout: 10000 });
      await contractBtn.click();

      // Modal cấu hình hợp đồng hiển thị z-[1000]
      const modal = page.locator('div.fixed.z-\\[1000\\]:has-text("Tạo Hợp Đồng Tự Động từ Dữ Liệu OCR")');
      await expect(modal).toBeVisible();

      // Đóng modal
      await modal.locator('button:has-text("Hủy")').first().click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });
    });

    test('API-32.5: Backend DocumentAi Controller quét tài liệu và lấy lịch sử trích xuất', async () => {
      // 1. Quét tài liệu OCR qua API
      const resScan = await fetch(`${BACKEND_URL}/api/v1/document-ai/scan`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: 'cccd',
          fileUrl: 'https://storage.novacrm.com/cccd-sample.jpg',
        }),
      });
      expect(resScan.status).toBe(201);
      const scanResult = await resScan.json();
      expect(scanResult.success).toBe(true);
      expect(scanResult.data).toHaveProperty('fields');

      // 2. Lấy lịch sử quét
      const resHist = await fetch(`${BACKEND_URL}/api/v1/document-ai/history`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(resHist.status).toBe(200);
      const hist = await resHist.json();
      expect(hist.success).toBe(true);
      expect(Array.isArray(hist.data)).toBe(true);
    });
  });

  // =========================================================================
  // 3. MODULE 33: BÁO CÁO THÔNG MINH BI DASHBOARD (/bi)
  // =========================================================================
  test.describe('33. Báo Cáo Thông Minh BI Dashboard (/bi)', () => {
    test('UI-33.1: Hiển thị BI Dashboard với các chỉ số vĩ mô GDV và Tỷ Lệ Hấp Thụ', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/bi`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Kiểm tra tiêu đề trang
      await expect(page.locator('text=Báo Cáo Phân Tích Thông Minh BI').first()).toBeVisible({ timeout: 10000 });

      // Kiểm tra KPI cards
      await expect(page.locator('text=Tổng Doanh Số HĐMB').first()).toBeVisible();
      await expect(page.locator('text=Dòng Tiền Đã Thực Thu').first()).toBeVisible();
      await expect(page.locator('text=Tỷ Lệ Hấp Thụ Giỏ Hàng').first()).toBeVisible();
    });

    test('UI-33.2: Mở Modal Mô Phỏng What-If Simulation điều chỉnh tham số dự báo', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/bi`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Bấm nút "Mô Phỏng What-If"
      const whatIfBtn = page.locator('button:has-text("Mô Phỏng What-If")').first();
      await expect(whatIfBtn).toBeVisible({ timeout: 10000 });
      await whatIfBtn.click();

      // Modal hiển thị
      const modal = page.locator('div[role="dialog"]:has-text("Trình Mô Phỏng Kịch Bản Tăng Trưởng AI")');
      await expect(modal).toBeVisible();

      // Kiểm tra kết quả dự phóng AI
      await expect(modal.locator('text=Kết Quả Dự Phóng AI Thời Gian Thực')).toBeVisible();
      await expect(modal.locator('text=Doanh Số Dự Kiến')).toBeVisible();

      // Đóng modal bằng nút Lưu Kịch Bản Này
      await modal.locator('button:has-text("Lưu Kịch Bản Này")').first().click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });
    });

    test('UI-33.3: Chuyển tab Bản Đồ Nhiệt Telesale (Heatmap) và click vào ô tương tác mở Modal', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/bi`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Chuyển sang Tab "Bản Đồ Nhiệt Tương Tác"
      const heatmapTab = page.locator('button[role="tab"]:has-text("Bản Đồ Nhiệt Tương Tác")');
      await heatmapTab.click();

      // Kiểm tra bảng nhiệt
      await expect(page.locator('text=Bản Đồ Nhiệt Tương Tác Khách Hàng')).toBeVisible({ timeout: 5000 });

      // Click vào một ô nhiệt bất kỳ
      const heatmapCell = page.locator('button[title*="tương tác"]').first();
      await expect(heatmapCell).toBeVisible();
      await heatmapCell.click();

      // Modal chi tiết tương tác mở ra
      const detailModal = page.locator('div[role="dialog"]:has-text("Chi Tiết Tương Tác Khung Giờ")');
      await expect(detailModal).toBeVisible();
      await detailModal.locator('button:has-text("Đóng Chi Tiết")').first().click();
      await expect(detailModal).not.toBeVisible({ timeout: 5000 });
    });

    test('UI-33.4: Chuyển đổi các Tab Phễu Bán Hàng & Dòng Tiền Dự Án', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/bi`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Chuyển tab Phễu Bán Hàng
      await page.locator('button[role="tab"]:has-text("Phễu Bán Hàng & Nút Thắt")').click();
      await expect(page.locator('text=Nút Thắt 1: Rớt Khách').or(page.locator('text=Chuyển đổi')).first()).toBeVisible({ timeout: 5000 });

      // Chuyển tab Dòng Tiền & Tồn Kho
      await page.locator('button[role="tab"]:has-text("Dòng Tiền & Tồn Kho Dự Án")').click();
      await expect(page.locator('text=Kế Hoạch Thu Tiền vs Dòng Tiền Thực Tế').first()).toBeVisible({ timeout: 5000 });
    });

    test('API-33.5: Backend BI Controller macro metrics và ARIMA forecast', async () => {
      // 1. Chỉ số vĩ mô
      const resMacro = await fetch(`${BACKEND_URL}/api/v1/bi/macro-metrics`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(resMacro.status).toBe(200);
      const macro = await resMacro.json();
      expect(macro.success).toBe(true);
      expect(macro.data).toHaveProperty('totalGDV');

      // 2. Dự báo ARIMA
      const resArima = await fetch(`${BACKEND_URL}/api/v1/bi/arima-forecast?months=6`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(resArima.status).toBe(200);
      const arima = await resArima.json();
      expect(arima.success).toBe(true);
      expect(Array.isArray(arima.data)).toBe(true);
      expect(arima.data[0]).toHaveProperty('month');
    });
  });

  // =========================================================================
  // 4. MODULE 34: CỔNG CHUYÊN VIÊN SALE (/agent)
  // =========================================================================
  test.describe('34. Cổng Chuyên Viên Sale (/agent)', () => {
    test('UI-34.1: Hiển thị Cổng Agent với KPI cá nhân, tiến độ hoa hồng và biểu đồ tuần', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/agent`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Kiểm tra tên Agent
      await expect(page.locator('text=Lê Hoàng Anh').first()).toBeVisible({ timeout: 10000 });

      // Kiểm tra các thẻ KPI
      await expect(page.locator('text=Doanh số thực đạt').or(page.locator('text=Doanh Số Thực Đạt')).first()).toBeVisible();
      await expect(page.locator('text=Hoa hồng tạm tính').or(page.locator('text=Hoa Hồng Tạm Tính')).first()).toBeVisible();
    });

    test('UI-34.2: Thêm Khách Hàng Tiềm Năng Mới với tên động Date.now() qua Modal', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/agent`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Bấm nút "+ Thêm Lead Mới"
      const addLeadBtn = page.locator('button:has-text("+ Thêm Lead Mới")').first();
      await expect(addLeadBtn).toBeVisible({ timeout: 10000 });
      await addLeadBtn.click();

      // Modal xuất hiện
      const modal = page.locator('div[role="dialog"]:has-text("Thêm Khách Hàng Tiềm Năng Mới")');
      await expect(modal).toBeVisible();

      // Nhập tên và SĐT động
      const dynamicLeadName = `Khách Hàng Sale ${Date.now().toString().slice(-4)}`;
      await modal.locator('input[placeholder*="Trần Văn Mạnh"]').fill(dynamicLeadName);
      await modal.locator('input[placeholder*="0988123456"]').fill('0909123456');

      // Submit modal
      await modal.locator('button[type="submit"]:has-text("Lưu Khách Hàng")').first().click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });
    });

    test('UI-34.3: Mở Modal Báo Giá Căn Hộ Dự Án Nhanh cho chuyên viên', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/agent`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Bấm nút "Báo Giá Nhanh"
      const priceBtn = page.locator('button:has-text("Báo Giá Nhanh")').first();
      await expect(priceBtn).toBeVisible({ timeout: 10000 });
      await priceBtn.click();

      // Modal hiển thị
      const modal = page.locator('div[role="dialog"]:has-text("Tạo Lời Nhắn Báo Giá Nhanh")');
      await expect(modal).toBeVisible();

      // Đóng modal
      await modal.locator('button:has-text("Đóng")').first().click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });
    });

    test('UI-34.4: Thao tác Check-in Sự Kiện Mở Bán qua Modal', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/agent`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Bấm nút "Điểm Danh GPS"
      const checkinBtn = page.locator('button:has-text("Điểm Danh GPS")').first();
      await expect(checkinBtn).toBeVisible({ timeout: 10000 });
      await checkinBtn.click();

      // Modal check-in hiển thị
      const modal = page.locator('div[role="dialog"]:has-text("Điểm Danh Tác Nghiệp (GPS Check-in)")');
      await expect(modal).toBeVisible();

      // Xác nhận check-in
      await modal.locator('button:has-text("Xác Nhận Check-in")').first().click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });
    });
  });

  // =========================================================================
  // 5. MODULE 35: CỔNG QUẢN LÝ MANAGER (/manager)
  // =========================================================================
  test.describe('35. Cổng Quản Lý Manager (/manager)', () => {
    test('UI-35.1: Hiển thị Cổng Trưởng Phòng Kinh Doanh với KPI toàn sàn và so sánh đội nhóm', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/manager`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Kiểm tra tiêu đề hoặc sàn kinh doanh
      await expect(page.locator('text=Bàn Quản Lý Trưởng Phòng').first()).toBeVisible({ timeout: 10000 });

      // Kiểm tra các chỉ số KPI
      await expect(page.locator('text=Doanh Thu Thực Thu').or(page.locator('text=Sàn Hội Sở Q1')).first()).toBeVisible();
    });

    test('UI-35.2: Mở Modal Phân Bổ Chỉ Tiêu Doanh Số Sàn (Quota Modal)', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/manager`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Bấm nút "Phân Bổ Quota"
      const quotaBtn = page.locator('button:has-text("Phân Bổ Quota")').first();
      await expect(quotaBtn).toBeVisible({ timeout: 10000 });
      await quotaBtn.click();

      // Modal hiển thị
      const modal = page.locator('div[role="dialog"]:has-text("Phân Bổ Quota Doanh Thu")');
      await expect(modal).toBeVisible();

      // Lưu phân bổ
      await modal.locator('button:has-text("Xác Nhận Phân Bổ Quota")').first().click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });
    });

    test('UI-35.3: Mở Modal Điều Chuyển Giỏ Lead Ads Nóng cho đội ngũ sale', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/manager`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Bấm nút "Chia Lead Nóng"
      const leadBtn = page.locator('button:has-text("Chia Lead Nóng")').first();
      await expect(leadBtn).toBeVisible({ timeout: 10000 });
      await leadBtn.click();

      // Modal hiển thị
      const modal = page.locator('div[role="dialog"]:has-text("Điều Phối Chia Lead Nóng Tự Động")');
      await expect(modal).toBeVisible();

      // Bấm kích hoạt chia lead
      await modal.locator('button:has-text("Kích Hoạt Phân Bổ Ngay")').first().click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });
    });

    test('UI-35.4: Kiểm tra Hộp Phê Duyệt Nhanh Cấp Quản Lý (Manager Approval Desk)', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/manager`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Kiểm tra khu vực phê duyệt nhanh
      const approvalDesk = page.locator('text=Hộp Phê Duyệt Nhanh Cấp Quản Lý').first();
      await expect(approvalDesk).toBeVisible({ timeout: 10000 });

      // Nếu có hồ sơ chờ duyệt, mở chi tiết và duyệt
      const detailBtn = page.locator('button:has-text("Chi Tiết")').first();
      if (await detailBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await detailBtn.click();
        const ticketModal = page.locator('div[role="dialog"]:has-text("Thẩm Định Chi Tiết Hồ Sơ")');
        if (await ticketModal.isVisible({ timeout: 3000 }).catch(() => false)) {
          await ticketModal.locator('button:has-text("Từ Chối")').or(ticketModal.locator('button:has-text("Phê Duyệt Hồ Sơ Này")')).or(ticketModal.locator('button:has(svg.lucide-x)')).first().click();
        }
      }
    });
  });

  // =========================================================================
  // 6. MODULE 36: CỔNG GIÁM ĐỐC DIRECTOR & C-LEVEL (/director)
  // =========================================================================
  test.describe('36. Cổng Giám Đốc Director & C-Level (/director)', () => {
    test('UI-36.1: Hiển thị Cổng Ban Giám Đốc / HĐQT với bức tranh tài chính toàn tập đoàn', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/director`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Kiểm tra tiêu đề hoặc Scope tập đoàn
      await expect(page.locator('text=Trung Tâm Chỉ Huy Chiến Lược').first()).toBeVisible({ timeout: 10000 });

      // Kiểm tra các chỉ số chiến lược vĩ mô
      await expect(page.locator('text=Tổng GDV Danh Mục').first()).toBeVisible();
      await expect(page.locator('text=Doanh Thu Đã Thu Lũy Kế').first()).toBeVisible();
    });

    test('UI-36.2: Chuyển đổi Scope quản trị cập nhật dữ liệu KPI tức thì', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/director`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Mở dropdown chọn Scope quản trị
      const scopeTrigger = page.locator('button:has(svg.lucide-compass)').first();
      await expect(scopeTrigger).toBeVisible({ timeout: 10000 });
      await scopeTrigger.click();

      // Chọn Khối Đô Thị Vệ Tinh
      const satelliteOption = page.locator('div[role="option"]:has-text("Khối Đô Thị Vệ Tinh")').or(page.locator('text=Khối Đô Thị Vệ Tinh')).first();
      if (await satelliteOption.isVisible({ timeout: 3000 }).catch(() => false)) {
        await satelliteOption.click();
        await page.waitForTimeout(500);
      }
    });

    test('UI-36.3: Mở Modal Phê Duyệt Kế Hoạch Ra Hàng Phân Khu Mới (Nghị Quyết Mở Bán)', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/director`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Bấm nút "Nghị Quyết Mở Bán"
      const launchBtn = page.locator('button:has-text("Nghị Quyết Mở Bán")').first();
      await expect(launchBtn).toBeVisible({ timeout: 10000 });
      await launchBtn.click();

      // Modal hiển thị
      const modal = page.locator('div[role="dialog"]:has-text("Nghị Quyết Ban Hành Mở Bán Phân Khu Mới")');
      await expect(modal).toBeVisible();

      // Đóng modal
      await modal.locator('button:has-text("Hủy")').first().click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });
    });

    test('UI-36.4: Mở Modal Xác Thực Ký Số Nghị Quyết HĐQT & Phê Chuẩn Điện Tử', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/director`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Bấm nút "Xác Thực Ký Số"
      const signBtn = page.locator('button:has-text("Xác Thực Ký Số")').first();
      if (await signBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await signBtn.click();

        // Modal xác thực chữ ký số hiển thị
        const signModal = page.locator('div[role="dialog"]:has-text("Xác Thực Chữ Ký Số C-Level")');
        await expect(signModal).toBeVisible();

        // Điền OTP ký số và bấm ký
        await signModal.locator('input[type="password"]').fill('123456');
        await signModal.locator('button:has-text("Ký Số & Ban Hành")').first().click();
        await expect(signModal).not.toBeVisible({ timeout: 5000 });
      }
    });
  });
});
