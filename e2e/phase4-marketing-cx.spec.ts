import { test, expect } from '@playwright/test';

const BACKEND_URL = 'http://localhost:4000';
const FRONTEND_URL = 'http://localhost:3000';

test.describe('Giai Đoạn 4: Marketing Tự Động, Khách Hàng Thân Thiết, CSAT, Referral, Gamification & Sàn B2B', () => {
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
  // 1. MODULE 19: MARKETING AUTOMATION & LEAD NURTURING (/marketing)
  // =========================================================================
  test.describe('19. Marketing Automation & Lead Nurturing (/marketing)', () => {
    test('UI-19.1: Khởi tạo và hiển thị Dashboard Marketing với 4 chỉ số KPI tổng hợp', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/marketing`);
      await page.waitForLoadState('domcontentloaded');

      // Kiểm tra Header chính
      const heading = page.locator('h1:has-text("Quản Trị Chiến Dịch Marketing & Phân Bổ Lead")');
      await expect(heading).toBeVisible({ timeout: 10000 });

      // Kiểm tra 4 Thẻ KPI động
      await expect(page.locator('text=Ngân Sách Tiếp Thị').first()).toBeVisible();
      await expect(page.locator('text=Tổng Leads Thu Về').first()).toBeVisible();
      await expect(page.locator('text=Chi Phí / Lead (CPL TB)').first()).toBeVisible();
      await expect(page.locator('text=Tỷ Lệ Chuyển Đổi Booking').first()).toBeVisible();
    });

    test('UI-19.2: Tạo chiến dịch quảng cáo mới với tên động Date.now() và kiểm tra render tức thì', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/marketing`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      const dynamicCampaignName = `Chiến Dịch LeadGen VIP-${Date.now()}`;

      // Bấm nút "Tạo Chiến Dịch Mới"
      const createBtn = page.locator('button:has-text("Tạo Chiến Dịch Mới")');
      await expect(createBtn).toBeVisible({ timeout: 10000 });
      await createBtn.click();

      // Kiểm tra Modal hiển thị (chỉ định chính xác header modal)
      const modal = page.locator('div[role="dialog"]:has-text("Tạo Chiến Dịch Marketing Mới")');
      await expect(modal).toBeVisible();

      // Điền thông tin chiến dịch
      await modal.locator('input[placeholder*="Lead Gen - The Grand Manhattan"]').fill(dynamicCampaignName);
      
      // Submit form
      await modal.locator('button[type="submit"]:has-text("Khởi Tạo Chiến Dịch")').click();

      // Kiểm tra chiến dịch mới xuất hiện trên UI
      await expect(page.locator(`text=${dynamicCampaignName}`).first()).toBeVisible({ timeout: 10000 });
    });

    test('UI-19.3: Giả lập bắn lead từ Form Ads, kích hoạt Smart Routing và kiểm tra Sổ Leads', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/marketing`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      const dynamicCustomerName = `Khách Hàng Facebook-${Date.now().toString().slice(-4)}`;
      const dynamicPhone = `0988${Date.now().toString().slice(-6)}`;

      // Bấm nút "Giả Lập Bắn Lead"
      const simBtn = page.locator('button:has-text("Giả Lập Bắn Lead")');
      await expect(simBtn).toBeVisible({ timeout: 10000 });
      await simBtn.click();

      const modal = page.locator('div[role="dialog"]:has-text("Giả Lập Khách Hàng Điền Form Quảng Cáo")');
      await expect(modal).toBeVisible();

      // Điền form giả lập
      await modal.locator('input').nth(0).fill(dynamicCustomerName);
      await modal.locator('input').nth(1).fill(dynamicPhone);
      await modal.locator('input').nth(2).fill('Quan tâm căn 2PN The Grand Manhattan');

      // Bắn lead
      await modal.locator('button:has-text("Bắn Lead Ngay")').click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });

      // Chuyển sang Tab Sổ Leads & Chia Lead
      await page.locator('button[role="tab"]:has-text("Sổ Leads & Chia Lead (Live)")').click();

      // Kiểm tra lead mới vừa bắn hiển thị ở dòng đầu tiên của bảng
      await expect(page.locator(`text=${dynamicCustomerName}`).first()).toBeVisible({ timeout: 10000 });
      await expect(page.locator(`text=${dynamicPhone}`).first()).toBeVisible();
      await expect(page.locator(`tr:has-text("${dynamicCustomerName}") >> text=Mới`).first()).toBeVisible();
    });

    test('UI-19.4: Thao tác gọi điện xử lý lead và điều chuyển sale (Re-assign Lead)', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/marketing`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Chuyển sang Tab Sổ Leads
      await page.locator('button[role="tab"]:has-text("Sổ Leads & Chia Lead (Live)")').click();

      // Tìm một lead có trạng thái "Mới" và bấm nút "Gọi"
      const firstNewRow = page.locator('tr:has-text("Mới")').first();
      await expect(firstNewRow).toBeVisible({ timeout: 10000 });
      await firstNewRow.locator('button:has-text("Gọi")').click();

      // Kiểm tra trạng thái trong bảng đã chuyển sang "Đã gọi"
      await expect(page.locator('tr:has-text("Đã gọi")').first()).toBeVisible({ timeout: 5000 });

      // Thử điều chuyển chuyên viên
      const leadRow = page.locator('tr:has-text("Đổi Sale")').first();
      await leadRow.locator('button:has-text("Đổi Sale")').click();

      // Modal chuyển giao hiển thị
      const reassignModal = page.locator('div[role="dialog"]:has-text("Điều Chuyển Lead Cho Chuyên Viên Khác")');
      await expect(reassignModal).toBeVisible();
      await reassignModal.locator('button:has-text("Xác Nhận Chuyển Giao")').click();
      await expect(reassignModal).not.toBeVisible({ timeout: 5000 });
    });

    test('API-19.5: Backend Marketing Controller đồng bộ đa kênh', async () => {
      // 1. Lấy danh sách chiến dịch
      const resList = await fetch(`${BACKEND_URL}/api/v1/marketing/campaigns`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(resList.status).toBe(200);
      const bodyList = await resList.json();
      expect(bodyList.success).toBe(true);
      expect(Array.isArray(bodyList.data)).toBe(true);

      // 2. Tạo chiến dịch mới qua Backend
      const uniqueCode = `CAMP-BE-${Date.now().toString().slice(-6)}`;
      const resCreate = await fetch(`${BACKEND_URL}/api/v1/marketing/campaigns`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: uniqueCode,
          platform: 'Facebook',
          budget: 50000000,
          targetCpl: 120000,
          startDate: '2026-10-01',
          endDate: '2026-10-31',
          targetAudience: 'Nhà đầu tư BĐS hạng sang',
        }),
      });
      expect(resCreate.status).toBe(201);
      const createData = await resCreate.json();
      expect(createData.data.name).toBe(uniqueCode);

      // 3. Webhook Ingest Lead
      const resLead = await fetch(`${BACKEND_URL}/api/v1/marketing/campaigns/${createData.data.id}/ingest-lead`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 5 }),
      });
      expect(resLead.status).toBe(201);

      // 4. Lấy Metrics
      const resMetrics = await fetch(`${BACKEND_URL}/api/v1/marketing/metrics`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(resMetrics.status).toBe(200);
      const metrics = await resMetrics.json();
      expect(metrics.data.totalBudget).toBeGreaterThan(0);
    });
  });

  // =========================================================================
  // 2. MODULE 20: KHÁCH HÀNG THÂN THIẾT NOVALOYALTY (/loyalty)
  // =========================================================================
  test.describe('20. Khách Hàng Thân Thiết NovaLoyalty (/loyalty)', () => {
    test('UI-20.1: Hiển thị Thẻ Hội Viên VIP, tính hạng thẻ và mở QR Digital Pass z-[1000]', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/loyalty`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      const heading = page.locator('h1:has-text("Đặc Quyền Hội Viên & Loyalty BĐS")');
      await expect(heading).toBeVisible({ timeout: 10000 });

      // Kiểm tra Thẻ Hội Viên VIP điện tử hiển thị
      await expect(page.locator('text=NOVALOYALTY').first()).toBeVisible();

      // Mở modal QR Pass bằng cách bấm vào biểu tượng hoặc thẻ
      const qrPassTrigger = page.locator('text=Mở QR Pass').first();
      await expect(qrPassTrigger).toBeVisible();
      await qrPassTrigger.click();

      // Modal hiển thị với z-[1000]
      const modal = page.locator('div.fixed.z-\\[1000\\]:has-text("NovaLoyalty Digital Pass")');
      await expect(modal).toBeVisible();
      await expect(modal.locator('text=Quét mã tại quầy lễ tân')).toBeVisible();

      // Đóng modal
      await modal.locator('button:has-text("✕")').click();
      await expect(modal).not.toBeVisible();
    });

    test('UI-20.2: Giả lập tích điểm giao dịch HĐMB (+50,000 PTS) và cập nhật số dư thời gian thực', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/loyalty`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Mở modal "Tích Điểm Giao Dịch (+)"
      const earnBtn = page.locator('button:has-text("Tích Điểm Giao Dịch (+)")');
      await expect(earnBtn).toBeVisible({ timeout: 10000 });
      await earnBtn.click();

      const modal = page.locator('div.fixed.z-\\[1000\\]:has-text("Giả Lập Tích Điểm Giao Dịch BĐS")');
      await expect(modal).toBeVisible();

      // Nhập giá trị giao dịch 8 tỷ VNĐ
      const amountInput = modal.locator('input[type="number"]');
      await amountInput.fill('8000000000');

      // Kiểm tra tính toán số điểm dự kiến
      await expect(modal.locator('text=Số điểm dự kiến cộng:')).toBeVisible();

      // Xác nhận tích điểm
      await modal.locator('button[type="submit"]:has-text("Xác Nhận Tích Điểm Ngay")').click();

      // Modal đóng và toast thành công xuất hiện
      await expect(modal).not.toBeVisible({ timeout: 5000 });

      // Kiểm tra tab Lịch Sử Điểm
      await page.locator('button[role="tab"]:has-text("Lịch Sử Điểm")').click();
      await expect(page.locator('text=Tích điểm ký HĐMB').first()).toBeVisible({ timeout: 5000 });
    });

    test('UI-20.3: Đổi Voucher quà tặng đặc quyền, sinh mã E-voucher động và mở QR trong ví', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/loyalty`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Chuyển sang Tab Cửa Hàng Quà Tặng
      await page.locator('button[role="tab"]:has-text("Cửa Hàng Quà Tặng")').click();

      // Bấm nút "Đổi Quà Ngay" trên sản phẩm đầu tiên
      const redeemBtn = page.locator('button:has-text("Đổi Quà Ngay")').first();
      await expect(redeemBtn).toBeVisible({ timeout: 10000 });
      await redeemBtn.click();

      // Popup đổi quà thành công hiển thị (z-[1000])
      const successPopup = page.locator('div.fixed.z-\\[1000\\]:has-text("Đổi Quà Thành Công!")');
      await expect(successPopup).toBeVisible();
      await expect(successPopup.locator('text=Mã E-Voucher Của Bạn')).toBeVisible();

      // Bấm "Hoàn Tất & Xem Túi Đồ"
      await successPopup.locator('button:has-text("Hoàn Tất & Xem Túi Đồ")').click();
      await expect(successPopup).not.toBeVisible({ timeout: 5000 });

      // Chuyển sang tab "Túi Quà Đã Đổi"
      await page.locator('button[role="tab"]:has-text("Túi Quà Đã Đổi")').click();

      // Kiểm tra và bấm nút "Mở Mã QR"
      const viewQrBtn = page.locator('button:has-text("Mở Mã QR")').first();
      await expect(viewQrBtn).toBeVisible({ timeout: 10000 });
      await viewQrBtn.click();

      // Modal E-voucher kích hoạt hiển thị
      const qrModal = page.locator('div.fixed.z-\\[1000\\]:has-text("E-Voucher Kích Hoạt")');
      await expect(qrModal).toBeVisible();

      // Bấm xác nhận đã dùng tại quầy
      await qrModal.locator('button:has-text("Xác Nhận Đã Dùng Tại Quầy")').click();
      await expect(qrModal).not.toBeVisible({ timeout: 5000 });
    });

    test('API-20.4: Backend Loyalty Controller cộng điểm & đổi voucher hợp lệ', async () => {
      // 1. Lấy danh sách Voucher
      const resVouchers = await fetch(`${BACKEND_URL}/api/v1/loyalty/vouchers`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(resVouchers.status).toBe(200);
      const vouchers = await resVouchers.json();
      expect(Array.isArray(vouchers.data)).toBe(true);

      // 2. Cộng điểm NovaPoints (sử dụng description chuẩn theo AwardPointsDto)
      const resAward = await fetch(`${BACKEND_URL}/api/v1/loyalty/award-points`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: 'c1',
          points: 50000,
          description: 'Ký HĐMB Biệt thự Aqua City',
          referenceCode: 'HD-AQC-8821',
        }),
      });
      expect(resAward.status).toBe(201);

      // 3. Đổi voucher
      const targetVoucher = vouchers.data[0];
      if (targetVoucher) {
        const resRedeem = await fetch(`${BACKEND_URL}/api/v1/loyalty/redeem`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerId: 'c1',
            voucherId: targetVoucher.id,
          }),
        });
        expect(resRedeem.status).toBe(201);
      }
    });
  });

  // =========================================================================
  // 3. MODULE 21: KHẢO SÁT & ĐO LƯỜNG CSAT/NPS (/surveys)
  // =========================================================================
  test.describe('21. Khảo Sát & Đo Lường CSAT (/surveys)', () => {
    test('UI-21.1: Hiển thị Báo cáo tổng hợp CSAT/NPS và phân tích độ hài lòng', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/surveys`);
      await page.waitForLoadState('domcontentloaded');

      const heading = page.locator('h1:has-text("Khảo Sát & Đo Lường Trải Nghiệm Khách Hàng")');
      await expect(heading).toBeVisible({ timeout: 10000 });

      // Kiểm tra 3 thẻ KPI chính
      await expect(page.locator('text=Tỷ Lệ Hài Lòng CSAT').first()).toBeVisible();
      await expect(page.locator('text=Chỉ Số NPS Tự Động').first()).toBeVisible();
      await expect(page.locator('text=Đánh Giá Trung Bình').first()).toBeVisible();
    });

    test('UI-21.2: Mô phỏng gửi phản hồi 5 sao tích cực và cập nhật ngay vào Live Feed', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/surveys`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      const dynamicCustomer = `Khách Hài Lòng-${Date.now().toString().slice(-4)}`;
      const commentText = `Nhân viên nhiệt tình, tư vấn dự án rất có tâm! ${Date.now()}`;

      // Bấm nút "Giả Lập Review"
      const simBtn = page.locator('button:has-text("Giả Lập Review")');
      await expect(simBtn).toBeVisible({ timeout: 10000 });
      await simBtn.click();

      const modal = page.locator('div[role="dialog"]:has-text("Giả Lập Đánh Giá Khách Hàng")');
      await expect(modal).toBeVisible();

      // Điền thông tin đánh giá 5 sao
      await modal.locator('input').nth(0).fill(dynamicCustomer);
      await modal.locator('input').nth(1).fill('0912334455');
      await modal.locator('textarea').fill(commentText);

      // Submit
      await modal.locator('button:has-text("Gửi Đánh Giá Ngay")').click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });

      // Chuyển sang Tab "Sổ Phản Hồi Đa Kênh"
      await page.locator('button[role="tab"]:has-text("Sổ Phản Hồi Đa Kênh")').click();

      // Kiểm tra review mới xuất hiện trên Feed
      await expect(page.locator(`text=${dynamicCustomer}`).first()).toBeVisible({ timeout: 10000 });
      await expect(page.locator(`text=${commentText}`).first()).toBeVisible();
    });

    test('UI-21.3: Tạo chiến dịch khảo sát tự động Zalo ZNS mới', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/surveys`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      const dynamicCampaignName = `Khảo Sát Khách VIP-${Date.now()}`;

      // Bấm nút "Tạo Chiến Dịch Mới" trên header
      const addBtn = page.locator('button:has-text("Tạo Chiến Dịch Mới")');
      await expect(addBtn).toBeVisible({ timeout: 10000 });
      await addBtn.click();

      const modal = page.locator('div[role="dialog"]:has-text("Tạo Chiến Dịch Khảo Sát Tự Động")');
      await expect(modal).toBeVisible();

      // Điền tên chiến dịch
      await modal.locator('input').nth(0).fill(dynamicCampaignName);

      // Kích hoạt
      await modal.locator('button:has-text("Kích Hoạt Chiến Dịch")').click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });

      // Chuyển sang Tab "Chiến Dịch Tự Động"
      const campTab = page.locator('button[role="tab"]:has-text("Chiến Dịch Tự Động")');
      await expect(campTab).toBeVisible({ timeout: 10000 });
      await campTab.click();

      // Kiểm tra chiến dịch mới hiển thị
      await expect(page.locator(`text=${dynamicCampaignName}`).first()).toBeVisible({ timeout: 10000 });
    });

    test('API-21.4: Backend Surveys Controller ghi nhận phản hồi và tính chỉ số NPS/CSAT', async () => {
      // 1. Lấy danh sách khảo sát
      const resCamp = await fetch(`${BACKEND_URL}/api/v1/surveys/campaigns`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(resCamp.status).toBe(200);
      const campData = await resCamp.json();
      expect(campData.success).toBe(true);

      // 2. Gửi phản hồi feedback
      const resFeedback = await fetch(`${BACKEND_URL}/api/v1/surveys/feedback`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Kiểm Thử Viên CSAT',
          customerPhone: '0988776655',
          rating: 5,
          category: 'BAN_GIAO',
          comment: 'Chất lượng hoàn thiện căn hộ xuất sắc, bàn giao đúng hạn.',
        }),
      });
      expect(resFeedback.status).toBe(201);

      // 3. Lấy báo cáo Metrics
      const resMetrics = await fetch(`${BACKEND_URL}/api/v1/surveys/metrics`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(resMetrics.status).toBe(200);
      const metrics = await resMetrics.json();
      expect(metrics.data.averageCSAT).toBeDefined();
      expect(metrics.data.averageNPS).toBeDefined();
    });
  });

  // =========================================================================
  // 4. MODULE 22: MẠNG LƯỚI CTV GIỚI THIỆU KHÁCH REFERRAL (/referral)
  // =========================================================================
  test.describe('22. Mạng Lưới CTV Giới Thiệu Khách Referral (/referral)', () => {
    test('UI-22.1: Hiển thị Mã giới thiệu CTV, liên kết Affiliate và sao chép link thành công', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/referral`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      const heading = page.locator('h1:has-text("Giới Thiệu Khách Hàng & Hoa Hồng BĐS")');
      await expect(heading).toBeVisible({ timeout: 10000 });

      // Kiểm tra Affiliate code & Link
      await expect(page.locator('text=TUANTU99').first()).toBeVisible();

      // Bấm nút Copy Link (icon copy)
      const copyBtn = page.locator('button:has(svg.lucide-copy)').first();
      await expect(copyBtn).toBeVisible();
      await copyBtn.click();

      // Toast thông báo đã sao chép hiển thị
      await expect(page.locator('text=Đã sao chép link tiếp thị:')).toBeVisible({ timeout: 5000 });
    });

    test('UI-22.2: Đăng ký khách hàng giới thiệu mới, tự tính hoa hồng 1.5% và lưu vào hệ thống', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/referral`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      const dynamicCustomerName = `Khách CTV-${Date.now().toString().slice(-4)}`;
      const dynamicPhone = `0909${Date.now().toString().slice(-6)}`;

      // Mở modal "Giới Thiệu Khách Mới"
      const addBtn = page.locator('button:has-text("Giới Thiệu Khách Mới")');
      await expect(addBtn).toBeVisible({ timeout: 10000 });
      await addBtn.click();

      const modal = page.locator('div.fixed.z-\\[1000\\]:has-text("Đăng Ký Khách Hàng Giới Thiệu Mới")');
      await expect(modal).toBeVisible();

      // Điền form
      await modal.locator('input[placeholder*="Nguyễn Hoàng Nam"]').fill(dynamicCustomerName);
      await modal.locator('input[placeholder*="0909 888 999"]').fill(dynamicPhone);
      await modal.locator('input[type="number"]').fill('6000000000'); // 6 tỷ

      // Kiểm tra hoa hồng tự tính 1.5% = 90.000.000 VNĐ
      await expect(modal.locator('text=90,000,000 VNĐ (1.5%)')).toBeVisible();

      // Xác nhận gửi
      await modal.locator('button[type="submit"]:has-text("Xác Nhận Giới Thiệu")').click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });

      // Chuyển sang Tab "Sổ Deal Giới Thiệu"
      await page.locator('button[role="tab"]:has-text("Sổ Deal Giới Thiệu")').click();

      // Kiểm tra deal vừa thêm hiển thị
      await expect(page.locator(`text=${dynamicCustomerName}`).first()).toBeVisible({ timeout: 10000 });
      await expect(page.locator(`text=${dynamicPhone}`).first()).toBeVisible();
    });

    test('UI-22.3: Lập yêu cầu rút tiền hoa hồng ngân hàng (Withdrawal Request Modal z-[1000])', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/referral`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Bấm nút "Yêu Cầu Rút Tiền"
      const withdrawBtn = page.locator('button:has-text("Yêu Cầu Rút Tiền")');
      await expect(withdrawBtn).toBeVisible({ timeout: 10000 });
      await withdrawBtn.click();

      const modal = page.locator('div.fixed.z-\\[1000\\]:has-text("Yêu Cầu Rút Tiền Hoa Hồng")');
      await expect(modal).toBeVisible();

      // Điền số tiền rút 200,000 VNĐ (nằm trong số dư khả dụng 250,000 VNĐ của CTV)
      await modal.locator('input[type="number"]').fill('200000');

      // Gửi lệnh rút tiền
      await modal.locator('button[type="submit"]:has-text("Gửi Lệnh Rút Tiền")').click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });

      // Chuyển sang Tab "Lịch Sử Rút Hoa Hồng"
      await page.locator('button[role="tab"]:has-text("Lịch Sử Rút Hoa Hồng")').click();
      await expect(page.locator('text=200,000 VNĐ').first()).toBeVisible({ timeout: 10000 });
    });
  });

  // =========================================================================
  // 5. MODULE 23: ĐUA TOP DOANH SỐ & GAMIFICATION (/gamification)
  // =========================================================================
  test.describe('23. Đua Top Doanh Số & Gamification (/gamification)', () => {
    test('UI-23.1: Hiển thị Bục vinh danh Podium Top 3 và Chiến Dịch Săn Boss Toàn Sàn', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/gamification`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      const heading = page.locator('h1:has-text("Đua Top & Gamification")');
      await expect(heading).toBeVisible({ timeout: 10000 });

      // Kiểm tra Top 1 MVP
      await expect(page.locator('text=Top 1 MVP').first()).toBeVisible();
      await expect(page.locator('text=Săn Boss Toàn Sàn')).toBeVisible();

      // Kiểm tra nút Điểm danh EXP hàng ngày
      const checkinBtn = page.locator('button:has-text("Điểm Danh +200 EXP")');
      await expect(checkinBtn).toBeVisible();
      await checkinBtn.click();
    });

    test('UI-23.2: Nhận thưởng hoàn thành nhiệm vụ (Claim Quest Reward)', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/gamification`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Chuyển sang Tab "Thử Thách & Boss"
      const questBtn = page.locator('button:has-text("Thử Thách & Boss")');
      await expect(questBtn).toBeVisible({ timeout: 10000 });
      await questBtn.click();

      // Tìm một nhiệm vụ đã hoàn thành có nút "Nhận Thưởng"
      const claimBtn = page.locator('button:has-text("Nhận Thưởng")').first();
      if (await claimBtn.isVisible()) {
        await claimBtn.click();
        await expect(page.locator('text=Chúc mừng! Bạn đã hoàn thành')).toBeVisible({ timeout: 5000 });
      } else {
        // Nếu tất cả đã nhận, kiểm tra badge "Đã Nhận Thưởng"
        await expect(page.locator('text=Đã Nhận Thưởng').first()).toBeVisible();
      }
    });

    test('UI-23.3: Mở Cửa Hàng Quà Tặng và đổi thưởng bằng điểm EXP (z-[1000])', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/gamification`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Chuyển sang Tab "Cửa Hàng Thưởng"
      const storeBtn = page.locator('button:has-text("Cửa Hàng Thưởng")');
      await expect(storeBtn).toBeVisible({ timeout: 10000 });
      await storeBtn.click();

      // Bấm nút "Đổi Quà Ngay" trên một món quà đủ điều kiện
      const redeemBtn = page.locator('button:has-text("Đổi Quà Ngay")').first();
      await expect(redeemBtn).toBeVisible({ timeout: 10000 });
      await redeemBtn.click();

      // Modal Xác Nhận Đổi Thưởng hiển thị
      const modal = page.locator('div.fixed.z-\\[1000\\]:has-text("Xác Nhận Đổi Thưởng")');
      await expect(modal).toBeVisible();

      // Xác nhận đổi quà
      await modal.locator('button:has-text("Xác Nhận Đổi Quà")').click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });

      // Toast đổi quà thành công hiển thị
      await expect(page.locator('text=Đổi quà thành công!')).toBeVisible({ timeout: 5000 });
    });

    test('UI-23.4: Tôn vinh đồng đội và gửi Kudos +100 EXP (Kudos Modal z-[1000])', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/gamification`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Bấm nút "Tôn Vinh MVP" trên bục Top 1
      const mvpBtn = page.locator('button:has-text("Tôn Vinh MVP")');
      await expect(mvpBtn).toBeVisible({ timeout: 10000 });
      await mvpBtn.click();

      // Modal gửi Kudos hiển thị
      const modal = page.locator('div.fixed.z-\\[1000\\]:has-text("Gửi Lời Chúc Mừng & Tặng EXP")');
      await expect(modal).toBeVisible();

      // Gửi vinh danh
      await modal.locator('button[type="submit"]:has-text("Gửi Vinh Danh")').click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });

      // Toast gửi lời chúc mừng xuất hiện
      await expect(page.locator('text=Đã gửi lời chúc mừng')).toBeVisible({ timeout: 5000 });
    });

    test('API-23.5: Backend Gamification Controller lấy bảng xếp hạng & danh mục nhiệm vụ', async () => {
      // 1. Leaderboard
      const resLeaderboard = await fetch(`${BACKEND_URL}/api/v1/gamification/leaderboard`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(resLeaderboard.status).toBe(200);
      const leaderboard = await resLeaderboard.json();
      expect(Array.isArray(leaderboard.data)).toBe(true);
      expect(leaderboard.data.length).toBeGreaterThan(0);

      // 2. Quests
      const resQuests = await fetch(`${BACKEND_URL}/api/v1/gamification/quests`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(resQuests.status).toBe(200);
      const quests = await resQuests.json();
      expect(Array.isArray(quests.data)).toBe(true);

      // 3. Badges
      const resBadges = await fetch(`${BACKEND_URL}/api/v1/gamification/badges`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(resBadges.status).toBe(200);
      const badges = await resBadges.json();
      expect(Array.isArray(badges.data)).toBe(true);
    });
  });

  // =========================================================================
  // 6. MODULE 24: SÀN GIAO DỊCH BÁN CHÉO B2B CO-BROKERING (/marketplace)
  // =========================================================================
  test.describe('24. Sàn Giao Dịch Bán Chéo B2B Co-brokering (/marketplace)', () => {
    test('UI-24.1: Hiển thị Rổ hàng bán chéo B2B, tỷ lệ hoa hồng F2 và thông tin chủ nguồn F1', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/marketplace`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      const heading = page.locator('h1:has-text("Sàn Giao Dịch Bán Chéo F2 & Co-brokering")');
      await expect(heading).toBeVisible({ timeout: 10000 });

      // Kiểm tra các thẻ phân loại
      await expect(page.locator('text=Rổ Hàng Bán Chéo F1/F2').first()).toBeVisible();

      // Kiểm tra hiển thị hoa hồng F2 thực nhận trên các sản phẩm
      await expect(page.locator('text=F2 Thực nhận:').first()).toBeVisible();
    });

    test('UI-24.2: Đăng nguồn hàng bán chéo mới lên sàn B2B với hoa hồng và diện tích chuẩn', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/marketplace`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      const dynamicTitle = `Dinh Thự Bán Chéo B2B-${Date.now()}`;

      // Bấm nút "Đăng Nguồn Hàng Bán Chéo"
      const addBtn = page.locator('button:has-text("Đăng Nguồn Hàng Bán Chéo")');
      await expect(addBtn).toBeVisible({ timeout: 10000 });
      await addBtn.click();

      const modal = page.locator('div.fixed.z-\\[1000\\]:has-text("Đăng Nguồn Hàng Bán Chéo Lên Sàn B2B")');
      await expect(modal).toBeVisible();

      // Điền thông tin nguồn hàng
      await modal.locator('input[placeholder*="Biệt thự đơn lập"]').fill(dynamicTitle);
      await modal.locator('input[placeholder*="35 Tỷ"]').fill('28 Tỷ');
      await modal.locator('input[placeholder*="1.5%"]').fill('1.8%');
      await modal.locator('input[placeholder*="Đường số 5"]').fill('Phân khu Đảo Phượng Hoàng Aqua City');

      // Submit
      await modal.locator('button[type="submit"]:has-text("Đăng Bán Chéo Ngay")').click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });

      // Kiểm tra sản phẩm mới hiển thị ngay trên bảng hàng
      await expect(page.locator(`text=${dynamicTitle}`).first()).toBeVisible({ timeout: 10000 });
      await expect(page.locator(`div:has-text("${dynamicTitle}") >> text=28 Tỷ`).first()).toBeVisible();
    });

    test('UI-24.3: Ký Thỏa Thuận Phân Phối Bán Chéo (Co-brokering Agreement) và bảo vệ nguồn khách 90 ngày', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/marketplace`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Tìm một sản phẩm có nút "Nhận Bán Chéo"
      const distributeBtn = page.locator('button:has-text("Nhận Bán Chéo")').first();
      await expect(distributeBtn).toBeVisible({ timeout: 10000 });
      await distributeBtn.click();

      // Modal Thỏa Thuận Phân Phối Bán Chéo hiển thị (z-[1000])
      const modal = page.locator('div.fixed.z-\\[1000\\]:has-text("Thỏa Thuận Phân Phối Bán Chéo")');
      await expect(modal).toBeVisible();

      // Kiểm tra điều khoản cam kết bảo vệ khách hàng 90 ngày
      await expect(modal.locator('text=Cam kết bảo vệ khách hàng 90 ngày')).toBeVisible();

      // Bấm "Ký Thỏa Thuận & Nhận Bảng Hàng"
      await modal.locator('button[type="submit"]:has-text("Ký Thỏa Thuận & Nhận Bảng Hàng")').click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });

      // Toast xác nhận hợp tác hiển thị
      await expect(page.locator('text=Đã ký thỏa thuận phân phối thành công sản phẩm')).toBeVisible({ timeout: 5000 });

      // Chuyển sang Tab "Hàng Tôi Nhận Phân Phối"
      await page.locator('button[role="tab"]:has-text("Hàng Tôi Nhận Phân Phối")').click();
      await expect(page.locator('text=Hợp Đồng Active').first()).toBeVisible({ timeout: 10000 });
      await expect(page.locator('button:has-text("Tải Bảng Hàng")').first()).toBeVisible();
    });

    test('UI-24.4: Mời đối tác đại lý liên minh gia nhập mạng lưới bán chéo (z-[1000])', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/marketplace`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Chuyển sang Tab "Mạng Lưới Sàn & Đại Lý"
      const partnerTab = page.locator('button[role="tab"]:has-text("Mạng Lưới Sàn & Đại Lý")');
      await expect(partnerTab).toBeVisible({ timeout: 10000 });
      await partnerTab.click();

      // Bấm nút "Mời Hợp Tác" trên đại lý đầu tiên
      const inviteBtn = page.locator('button:has-text("Mời Hợp Tác")').first();
      await expect(inviteBtn).toBeVisible({ timeout: 10000 });
      await inviteBtn.click();

      // Modal Mời Hợp Tác Đại Lý B2B hiển thị (z-[1000])
      const modal = page.locator('div.fixed.z-\\[1000\\]:has-text("Mời Hợp Tác Đại Lý B2B")');
      await expect(modal).toBeVisible();

      // Bấm "Gửi Lời Mời Ngay"
      await modal.locator('button:has-text("Gửi Lời Mời Ngay")').click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });

      // Toast gửi lời mời thành công hiển thị
      await expect(page.locator('text=Đã gửi lời mời hợp tác')).toBeVisible({ timeout: 5000 });
    });

    test('API-24.5: Backend Marketplace Controller đăng tin & gửi yêu cầu Co-brokering', async () => {
      // 1. Lấy danh sách sản phẩm rổ hàng chung
      const resList = await fetch(`${BACKEND_URL}/api/v1/marketplace/listings`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(resList.status).toBe(200);
      const listings = await resList.json();
      expect(Array.isArray(listings.data)).toBe(true);

      // 2. Đăng tin bán chéo mới (kèm district theo CreateMarketplaceListingDto)
      const uniqueTitle = `Biệt thự F1-${Date.now().toString().slice(-6)}`;
      const resCreate = await fetch(`${BACKEND_URL}/api/v1/marketplace/listings`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uniqueTitle,
          price: 25000000000,
          type: 'SALE',
          propertyCategory: 'VILLA',
          location: 'Thảo Điền, TP. Thủ Đức',
          district: 'TP. Thủ Đức',
          f2CommissionRate: 1.5,
          commissionSplit: '50/50',
          area: 300,
          ownerAgency: 'Sàn BĐS Novaland Master',
        }),
      });
      expect(resCreate.status).toBe(201);
      const createdItem = await resCreate.json();

      // 3. Gửi yêu cầu Co-brokering
      const resCoBroker = await fetch(`${BACKEND_URL}/api/v1/marketplace/listings/${createdItem.data.id}/co-broker`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerName: 'Đại lý BĐS ERA Vietnam',
          clientName: 'Khách VIP Trần Đình Trọng',
        }),
      });
      expect(resCoBroker.status).toBe(201);

      // 4. Lấy danh sách đại lý đối tác
      const resPartners = await fetch(`${BACKEND_URL}/api/v1/marketplace/partners`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(resPartners.status).toBe(200);
      const partners = await resPartners.json();
      expect(Array.isArray(partners.data)).toBe(true);
    });
  });
});
