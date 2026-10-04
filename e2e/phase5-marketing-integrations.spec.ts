import { test, expect } from '@playwright/test';

const BACKEND_URL = 'http://localhost:4000';
const FRONTEND_URL = 'http://localhost:3000';

test.describe('Giai Đoạn 5: Marketing Omnichannel, Loyalty, Gamification, Marketplace B2B, Surveys, Mortgage, BI & Integrations ERP', () => {
  let authToken = '';

  test.beforeAll(async () => {
    // Đăng nhập tài khoản admin để lấy Bearer token kiểm thử
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

  // -------------------------------------------------------------
  // 1. MODULE MARKETING: CHIẾN DỊCH QUẢNG CÁO & ĐIỀU PHỐI LEAD
  // -------------------------------------------------------------
  test('Marketing API: Lấy danh sách chiến dịch tiếp thị và số liệu CPL', async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/marketing/campaigns`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(3);

    const camp = body.data[0];
    expect(camp.name).toBeDefined();
    expect(Number(camp.budget)).toBeGreaterThan(0);
    expect(camp.routingRule).toBeDefined();
  });

  test('Marketing API: Tổng hợp chỉ số kinh doanh ROI, CPL và phân bổ nền tảng', async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/marketing/metrics`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.totalBudget).toBeGreaterThan(0);
    expect(body.data.totalSpent).toBeGreaterThan(0);
    expect(body.data.averageCPL).toBeGreaterThanOrEqual(0);
    expect(body.data.platformDistribution).toBeDefined();
  });

  // -------------------------------------------------------------
  // 2. MODULE LOYALTY: NOVACLUB & ĐỔI VOUCHER QUÀ TẶNG
  // -------------------------------------------------------------
  test('Loyalty API: Lấy danh mục Voucher quà tặng và quy đổi điểm thưởng', async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/loyalty/vouchers`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(3);

    const voucher = body.data[0];
    expect(voucher.code).toMatch(/^VCH-/);
    expect(voucher.points).toBeGreaterThan(0);
    expect(voucher.stock).toBeGreaterThan(0);
  });

  // -------------------------------------------------------------
  // 3. MODULE GAMIFICATION: NHIỆM VỤ, HUY HIỆU & LEADERBOARD
  // -------------------------------------------------------------
  test('Gamification API: Danh sách Quests và huy hiệu Badges', async () => {
    const questsRes = await fetch(`${BACKEND_URL}/api/v1/gamification/quests`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(questsRes.status).toBe(200);
    const questsBody = await questsRes.json();
    expect(questsBody.success).toBe(true);
    expect(questsBody.data.length).toBeGreaterThanOrEqual(3);

    const badgesRes = await fetch(`${BACKEND_URL}/api/v1/gamification/badges`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(badgesRes.status).toBe(200);
    const badgesBody = await badgesRes.json();
    expect(badgesBody.success).toBe(true);
    expect(badgesBody.data.length).toBeGreaterThanOrEqual(2);
  });

  // -------------------------------------------------------------
  // 4. MODULE MARKETPLACE B2B: CO-BROKERING 50/50 & ĐẠI LÝ F1/F2
  // -------------------------------------------------------------
  test('Marketplace API: Danh mục hàng B2B và yêu cầu bán chéo 50/50', async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/marketplace/listings`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(2);

    const item = body.data[0];
    expect(item.commSplit).toBe('50/50');
    expect(item.ownerAgency).toBeDefined();

    // Thử gửi yêu cầu Co-brokering
    const coRes = await fetch(`${BACKEND_URL}/api/v1/marketplace/listings/${item.id}/co-broker`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerName: 'Đại Lý F2 CenLand', clientName: 'Nguyễn Văn VIP' }),
    });
    expect(coRes.status).toBe(201);
    const coBody = await coRes.json();
    expect(coBody.success).toBe(true);
    expect(coBody.data.contractCode).toMatch(/^COBROKER-/);
  });

  // -------------------------------------------------------------
  // 5. MODULE SURVEYS: NPS/CSAT & PHÂN TÍCH CẢM XÚC PHẢN HỒI
  // -------------------------------------------------------------
  test('Surveys API: Báo cáo chỉ số trải nghiệm NPS/CSAT và gửi phản hồi', async () => {
    const metricsRes = await fetch(`${BACKEND_URL}/api/v1/surveys/metrics`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(metricsRes.status).toBe(200);
    const metricsBody = await metricsRes.json();
    expect(metricsBody.success).toBe(true);
    expect(metricsBody.data.averageCSAT).toBeGreaterThan(0);
    expect(metricsBody.data.averageNPS).toBeGreaterThan(0);

    // Gửi phản hồi mới
    const fbRes = await fetch(`${BACKEND_URL}/api/v1/surveys/feedback`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Khách Hàng E2E Test',
        rating: 5,
        category: 'Bàn giao',
        comment: 'Dịch vụ rất tốt và chuyên nghiệp',
      }),
    });
    expect(fbRes.status).toBe(201);
    const fbBody = await fbRes.json();
    expect(fbBody.success).toBe(true);
    expect(fbBody.data.sentiment).toBe('POSITIVE');
  });

  // -------------------------------------------------------------
  // 6. MODULE MORTGAGE: ĐỘNG CƠ TÀI CHÍNH TÍN DỤNG 360 THÁNG
  // -------------------------------------------------------------
  test('Mortgage API: Tính toán lịch khấu hao vay 360 tháng và tỷ lệ nợ DTI', async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/mortgage/calculate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyValue: 5000000000,
        loanPercent: 70,
        loanTermYears: 20,
        preferentialRate: 6.5,
        preferentialMonths: 12,
        floatingRate: 9.8,
        repaymentMethod: 'reducing',
        enableGracePeriod: true,
        graceMonths: 12,
        monthlyIncome: 80000000,
      }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.loanAmount).toBe(3500000000);
    expect(body.data.dtiRatio).toBeGreaterThan(0);
    expect(body.data.scheduleSummary.length).toBe(36);
  });

  // -------------------------------------------------------------
  // 7. MODULE BI & ANALYTICS: MACRO GDV & ARIMA DỰ BÁO
  // -------------------------------------------------------------
  test('BI API: Dự báo doanh thu chuỗi thời gian ARIMA(1,1,1) & Heatmap Telesale', async () => {
    const forecastRes = await fetch(`${BACKEND_URL}/api/v1/bi/arima-forecast`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(forecastRes.status).toBe(200);
    const forecastBody = await forecastRes.json();
    expect(forecastBody.success).toBe(true);
    expect(forecastBody.data.length).toBe(8);

    const heatmapRes = await fetch(`${BACKEND_URL}/api/v1/bi/telesale-heatmap`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(heatmapRes.status).toBe(200);
    const heatmapBody = await heatmapRes.json();
    expect(heatmapBody.success).toBe(true);
    expect(heatmapBody.data.length).toBe(49);
  });

  // -------------------------------------------------------------
  // 8. MODULE INTEGRATIONS: ERP MISA/SAP, SMARTCA & WEBHOOKS
  // -------------------------------------------------------------
  test('Integrations API: Danh mục ứng dụng kết nối và xác thực SmartCA', async () => {
    const appsRes = await fetch(`${BACKEND_URL}/api/v1/integrations/apps`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(appsRes.status).toBe(200);
    const appsBody = await appsRes.json();
    expect(appsBody.success).toBe(true);
    expect(appsBody.data.length).toBeGreaterThanOrEqual(4);

    // Kiểm tra API SmartCA verify
    const caRes = await fetch(`${BACKEND_URL}/api/v1/integrations/smartca/verify`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        signatureData: 'MIIEvgYJKoZIhvcNAQcCoIIEr...',
        documentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      }),
    });
    expect(caRes.status).toBe(201);
    const caBody = await caRes.json();
    expect(caBody.success).toBe(true);
    expect(caBody.data.isValid).toBe(true);
  });

  // -------------------------------------------------------------
  // 9. KIỂM THỬ TRẢI NGHIỆM GIAO DIỆN FRONTEND GIAI ĐOẠN 5 (UI E2E)
  // -------------------------------------------------------------
  test('UI Frontend: Tải và tương tác Quản Trị Chiến Dịch Marketing (/marketing)', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: authToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);
    await page.goto(`${FRONTEND_URL}/marketing`, { timeout: 30000 });
    await expect(page).toHaveURL(/.*\/marketing/);
    await expect(page.locator('body')).toContainText(/Quản Trị Chiến Dịch Marketing & Phân Bổ Lead/i, { timeout: 15000 });
    await expect(page.locator('body')).toContainText(/Smart Lead Routing/i);
  });

  test('UI Frontend: Tải và tương tác Đặc Quyền Hội Viên & Loyalty BĐS (/loyalty)', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: authToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);
    await page.goto(`${FRONTEND_URL}/loyalty`, { timeout: 30000 });
    await expect(page).toHaveURL(/.*\/loyalty/);
    await expect(page.locator('body')).toContainText(/Đặc Quyền Hội Viên & Loyalty BĐS/i, { timeout: 15000 });
  });

  test('UI Frontend: Tải và tương tác Đua Top & Gamification (/gamification)', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: authToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);
    await page.goto(`${FRONTEND_URL}/gamification`, { timeout: 30000 });
    await expect(page).toHaveURL(/.*\/gamification/);
    await expect(page.locator('body')).toContainText(/Đua Top & Gamification/i, { timeout: 15000 });
  });

  test('UI Frontend: Tải và tương tác Sàn Giao Dịch Bán Chéo F2 & Co-brokering (/marketplace)', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: authToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);
    await page.goto(`${FRONTEND_URL}/marketplace`, { timeout: 30000 });
    await expect(page).toHaveURL(/.*\/marketplace/);
    await expect(page.locator('body')).toContainText(/Sàn Giao Dịch Bán Chéo F2 & Co-brokering/i, { timeout: 15000 });
  });

  test('UI Frontend: Tải và tương tác Khảo Sát & Đo Lường Trải Nghiệm Khách Hàng (/surveys)', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: authToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);
    await page.goto(`${FRONTEND_URL}/surveys`, { timeout: 30000 });
    await expect(page).toHaveURL(/.*\/surveys/);
    await expect(page.locator('body')).toContainText(/Khảo Sát & Đo Lường Trải Nghiệm Khách Hàng/i, { timeout: 15000 });
  });

  test('UI Frontend: Tải và tương tác Bảng Tính Lãi Vay & Dòng Tiền Đầu Tư BĐS (/mortgage)', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: authToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);
    await page.goto(`${FRONTEND_URL}/mortgage`, { timeout: 30000 });
    await expect(page).toHaveURL(/.*\/mortgage/);
    await expect(page.locator('body')).toContainText(/Bảng Tính Lãi Vay & Dòng Tiền Đầu Tư BĐS/i, { timeout: 15000 });
  });

  test('UI Frontend: Tải và tương tác Báo Cáo Phân Tích Thông Minh BI (/bi)', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: authToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);
    await page.goto(`${FRONTEND_URL}/bi`, { timeout: 30000 });
    await expect(page).toHaveURL(/.*\/bi/);
    await expect(page.locator('body')).toContainText(/Báo Cáo Phân Tích Thông Minh BI/i, { timeout: 15000 });
  });

  test('UI Frontend: Tải và tương tác Cổng Tích Hợp API, Webhook & ERP Doanh Nghiệp (/integrations)', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: authToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);
    await page.goto(`${FRONTEND_URL}/integrations`, { timeout: 30000 });
    await expect(page).toHaveURL(/.*\/integrations/);
    await expect(page.locator('body')).toContainText(/Cổng Tích Hợp API, Webhook & ERP Doanh Nghiệp/i, { timeout: 15000 });
  });
});
