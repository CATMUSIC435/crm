import { test, expect } from '@playwright/test';

test.describe('KIỂM TRA CHUYÊN SÂU GIAI ĐOẠN 1 (PHASE 1 FOUNDATION & CORE REAL ESTATE MODULES)', () => {

  let adminToken: string;
  let agentToken: string;

  test.beforeAll(async ({ request }) => {
    // 1. Lấy Token của Quản trị viên (SUPER_ADMIN)
    const adminLoginRes = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: 'admin@novacrm.com', password: 'password123' },
    });
    expect(adminLoginRes.status()).toBe(200);
    const adminData = (await adminLoginRes.json()).data || (await adminLoginRes.json());
    adminToken = adminData.accessToken;

    // 2. Lấy Token của Chuyên viên môi giới (AGENT)
    const agentLoginRes = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: 'agent@novacrm.com', password: 'password123' },
    });
    expect(agentLoginRes.status()).toBe(200);
    const agentData = (await agentLoginRes.json()).data || (await agentLoginRes.json());
    agentToken = agentData.accessToken;
  });

  // =========================================================================
  // PHẦN 1: MODULE XÁC THỰC & HỒ SƠ TÀI KHOẢN (AUTH & IDENTITY)
  // =========================================================================

  test('1.1. Auth: Đăng nhập thành công và truy vấn thông tin Profile với JWT Token', async ({ request }) => {
    const res = await request.get('http://localhost:4000/api/v1/auth/profile', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    const profile = body.data || body;

    expect(profile.email).toBe('admin@novacrm.com');
    expect(profile.role).toBe('SUPER_ADMIN');
    expect(profile.level).toBeGreaterThanOrEqual(1);
    expect(profile.fullName).toBeDefined();
  });

  test('1.2. Auth: Đổi mật khẩu người dùng đang đăng nhập', async ({ request }) => {
    // 1. Tạo tài khoản tạm riêng biệt để test vòng đời đổi mật khẩu
    const tempEmail = `agent.temp.${Date.now()}@novacrm.com`;
    const regRes = await request.post('http://localhost:4000/api/v1/auth/register', {
      data: {
        email: tempEmail,
        password: 'password123',
        fullName: 'Agent Đổi Mật Khẩu',
        phone: '09' + Math.floor(10000000 + Math.random() * 90000000),
      },
    });
    expect(regRes.status()).toBe(201);
    const tempToken = ((await regRes.json()).data || (await regRes.json())).accessToken;

    // 2. Thực hiện đổi mật khẩu
    const changePassRes = await request.post('http://localhost:4000/api/v1/auth/change-password', {
      headers: { Authorization: `Bearer ${tempToken}` },
      data: {
        oldPassword: 'password123',
        newPassword: 'newPassword@2026',
      },
    });
    expect(changePassRes.status()).toBe(200);
    const body = await changePassRes.json();
    expect(body.success).toBe(true);

    // 3. Đăng nhập lại với mật khẩu mới thành công
    const newLoginRes = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: tempEmail, password: 'newPassword@2026' },
    });
    expect(newLoginRes.status()).toBe(200);
  });

  test('1.3. Auth: Khởi tạo mã bí mật và URI QR-Code cho xác thực 2 bước (2FA)', async ({ request }) => {
    const res = await request.post('http://localhost:4000/api/v1/auth/2fa/generate', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(res.status()).toBe(200);
    const data = (await res.json()).data || (await res.json());
    expect(data.secret).toBeDefined();
    expect(data.otpauthUrl).toContain('otpauth://totp/NovaCRM');
  });

  // =========================================================================
  // PHẦN 2: MODULE ĐẠI DỰ ÁN (PROJECTS)
  // =========================================================================

  test('2.1. Projects API: Truy vấn danh mục đại đô thị và kiểm tra cấu trúc dữ liệu', async ({ request }) => {
    const res = await request.get('http://localhost:4000/api/v1/projects', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    const projects = body.data || body;

    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThanOrEqual(3);

    // Kiểm tra đại dự án NovaWorld Phan Thiet
    const p1 = projects.find((p: any) => p.code === 'P01' || p.name.includes('NovaWorld'));
    expect(p1).toBeDefined();
    expect(p1.location).toContain('Phan Thiết');
    expect(p1.totalUnits).toBeGreaterThan(0);
  });

  test('2.2. Projects API: Lọc đại dự án theo tình trạng mở bán (Status Filter)', async ({ request }) => {
    const res = await request.get('http://localhost:4000/api/v1/projects?status=OPENING', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    const projects = body.data || body;

    expect(Array.isArray(projects)).toBe(true);
    projects.forEach((p: any) => {
      expect(p.status).toBe('OPENING');
    });
  });

  test('2.3. Projects API: Chi tiết đại dự án và chỉ số phân tích đầu tư AI', async ({ request }) => {
    const res = await request.get('http://localhost:4000/api/v1/projects/p1', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    const project = body.data || body;

    expect(project.id).toBe('p1');
    expect(project.aiAnalysis).toBeDefined();
    expect(project.aiAnalysis.rating).toBe('STRONG BUY');
  });

  test('2.4. Projects API: Thêm mới đại dự án (Phân quyền Quản trị viên)', async ({ request }) => {
    const newCode = 'P_TEST_' + Date.now();
    const res = await request.post('http://localhost:4000/api/v1/projects', {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: {
        code: newCode,
        name: 'Dự Án Test Tự Động Playwright',
        location: 'Khu Đô Thị Sáng Tạo Thủ Đức',
        developer: 'Tập đoàn NovaCRM',
        type: 'Khu phức hợp Căn hộ & Thương mại',
        totalUnits: 500,
        targetRevenue: 2500000000000,
      },
    });

    expect(res.status()).toBe(201);
    const created = (await res.json()).data || (await res.json());
    expect(created.code).toBe(newCode);
    expect(created.name).toBe('Dự Án Test Tự Động Playwright');
  });

  // =========================================================================
  // PHẦN 3: MODULE RỔ HÀNG & PHÂN LÔ CĂN HỘ (INVENTORY)
  // =========================================================================

  test('3.1. Inventory API: Truy vấn rổ hàng với bộ lọc 6 chiều (Dự án, Giá, Trạng thái)', async ({ request }) => {
    // Lọc các căn hộ trống của dự án p1
    const res = await request.get('http://localhost:4000/api/v1/inventory?projectId=p1&status=AVAILABLE', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    const units = body.data || body;

    expect(Array.isArray(units)).toBe(true);
    units.forEach((u: any) => {
      expect(u.projectId).toBe('p1');
      expect(u.status).toBe('AVAILABLE');
    });
  });

  test('3.2. Inventory API: Chỉ số thống kê KPI rổ hàng & Tỷ lệ hấp thụ', async ({ request }) => {
    const res = await request.get('http://localhost:4000/api/v1/inventory/stats', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    const stats = body.data || body;

    expect(stats.total).toBeGreaterThan(0);
    expect(stats.available).toBeGreaterThanOrEqual(0);
    expect(stats.booking).toBeGreaterThanOrEqual(0);
    expect(stats.sold).toBeGreaterThanOrEqual(0);
    expect(typeof stats.absorptionRate).toBe('number');
  });

  test('3.3. Inventory API: Chi tiết căn hộ, thông số kỹ thuật và chiết khấu', async ({ request }) => {
    const res = await request.get('http://localhost:4000/api/v1/inventory/i2', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    const unit = body.data || body;

    expect(unit.id).toBe('i2');
    expect(unit.code).toBe('NVW-01.02');
    expect(unit.price).toBeGreaterThan(0);
    expect(unit.bedrooms).toBeGreaterThan(0);
  });

  test('3.4. Inventory API: Thao tác khóa nội bộ hàng loạt (Batch Lock)', async ({ request }) => {
    const res = await request.post('http://localhost:4000/api/v1/inventory/batch-lock', {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: {
        unitIds: ['i2'],
        targetStatus: 'LOCKED',
      },
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    const data = body.data || body;
    expect(data.updatedCount).toBeGreaterThanOrEqual(1);

    // Mở khóa lại căn hộ để bảo lưu dữ liệu
    await request.post('http://localhost:4000/api/v1/inventory/batch-lock', {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: {
        unitIds: ['i2'],
        targetStatus: 'AVAILABLE',
      },
    });
  });

  // =========================================================================
  // PHẦN 4: MODULE KHÁCH HÀNG 360° (CUSTOMERS)
  // =========================================================================

  test('4.1. Customers API: Truy vấn danh bạ khách hàng và lọc theo hạng VIP Diamond', async ({ request }) => {
    const res = await request.get('http://localhost:4000/api/v1/customers?rank=DIAMOND_VVIP', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    const customers = body.data || body;

    expect(Array.isArray(customers)).toBe(true);
    expect(customers.length).toBeGreaterThanOrEqual(1);
    customers.forEach((c: any) => {
      expect(c.rank).toBe('DIAMOND_VVIP');
    });
  });

  test('4.2. Customers API: Thêm mới khách hàng vào pipeline tư vấn', async ({ request }) => {
    const phone = '0988' + Math.floor(100000 + Math.random() * 900000);
    const res = await request.post('http://localhost:4000/api/v1/customers', {
      headers: { Authorization: `Bearer ${agentToken}` },
      data: {
        fullName: 'Trương Gia Bình (VIP Test)',
        phone: phone,
        email: `vip.test.${Date.now()}@fpt.vn`,
        rank: 'DIAMOND_VVIP',
      },
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    const newCust = body.data || body;
    expect(newCust.code).toBeDefined();
    expect(newCust.fullName).toBe('Trương Gia Bình (VIP Test)');
  });

  // =========================================================================
  // PHẦN 5: TRẢI NGHIỆM GIAO DIỆN NGƯỜI DÙNG E2E (FRONTEND DASHBOARD PAGES)
  // =========================================================================

  test('5.1. Frontend UI: Trang Kho Dự Án (/projects) hiển thị danh mục đại đô thị và bộ lọc', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/projects');
    
    // Kiểm tra tiêu đề trang và danh sách dự án
    await expect(page.locator('text=Quản Lý Đại Dự Án').or(page.locator('text=Dự Án')).first()).toBeVisible();
    await expect(page.locator('text=NovaWorld Phan Thiet').first()).toBeVisible();
    await expect(page.locator('text=Aqua City').first()).toBeVisible();
  });

  test('5.2. Frontend UI: Trang Rổ Hàng (/inventory) hiển thị KPI và Ma Trận Phân Lô', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/inventory');

    // Kiểm tra các nhãn KPI chủ lực
    await expect(page.locator('text=Tổng sản phẩm').or(page.locator('text=Tổng số căn')).or(page.locator('text=Rổ Hàng')).first()).toBeVisible();
    // Kiểm tra hiển thị mã căn hộ
    await expect(page.locator('text=NVW-01.01').or(page.locator('text=NVW-01.02')).first()).toBeVisible();
  });

  test('5.3. Frontend UI: Trang Khách Hàng (/customers) hiển thị bảng 360 và bộ lọc VIP', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/customers');

    // Kiểm tra hiển thị danh bạ khách hàng
    await expect(page.locator('text=Khách Hàng 360').or(page.locator('text=Danh Bạ Khách Hàng')).or(page.locator('text=Nguyễn Văn Tuấn')).first()).toBeVisible();
  });

  test('5.4. Frontend Rewrite Proxy: Kết nối thông suốt qua /backend-api/projects', async ({ request }) => {
    const res = await request.get('http://localhost:3000/backend-api/projects', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    const data = body.data || body;
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(1);
  });
});
