import { test, expect } from '@playwright/test';

test.describe('Kiểm tra Auth Chặt Chẽ & Phân Quyền Người Dùng (RBAC)', () => {

  test('1. Backend Auth: Đăng nhập cấp phát Access Token & Refresh Token hợp lệ', async ({ request }) => {
    const res = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: {
        email: 'admin@novacrm.com',
        password: 'password123',
      },
    });

    expect(res.status()).toBe(200);
    const json = await res.json();
    const data = json.data || json;

    expect(data.accessToken).toBeDefined();
    expect(data.refreshToken).toBeDefined();
    expect(data.user).toBeDefined();
    expect(data.user.role).toBe('SUPER_ADMIN');
    expect(data.user.email).toBe('admin@novacrm.com');
  });

  test('2. Backend Auth: Chặn truy cập trái phép khi không có JWT Token (401 Unauthorized)', async ({ request }) => {
    const res = await request.get('http://localhost:4000/api/v1/contracts');
    expect(res.status()).toBe(401);
  });

  test('3. Backend RBAC: Chặn vai trò không đủ thẩm quyền (403 Forbidden)', async ({ request }) => {
    // 1. Đăng ký một tài khoản AGENT mới
    const testEmail = `agent.test.${Date.now()}@novacrm.com`;
    const regRes = await request.post('http://localhost:4000/api/v1/auth/register', {
      data: {
        email: testEmail,
        password: 'password123',
        fullName: 'Agent Kiểm Thử RBAC',
        phone: '09' + Math.floor(10000000 + Math.random() * 90000000),
      },
    });

    expect(regRes.status()).toBe(201);
    const regJson = await regRes.json();
    const agentToken = (regJson.data || regJson).accessToken;

    // 2. Thử dùng token của AGENT gọi endpoint chỉ dành cho ACCOUNTANT / ADMIN (Ghi nhận thanh toán)
    const paymentRes = await request.post('http://localhost:4000/api/v1/contracts/ctr-test/payments', {
      headers: {
        Authorization: `Bearer ${agentToken}`,
      },
      data: {
        amount: 50000000,
        phase: 1,
        note: 'Hacking attempt by agent',
      },
    });

    // Bắt buộc phải bị từ chối 403 Forbidden!
    expect(paymentRes.status()).toBe(403);
    const errText = await paymentRes.text();
    expect(errText).toContain('Quyền truy cập bị từ chối');
  });

  test('4. Backend Auth: Làm mới Access Token thông qua Refresh Token hợp lệ', async ({ request }) => {
    // 1. Đăng nhập lấy token
    const loginRes = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: {
        email: 'admin@novacrm.com',
        password: 'password123',
      },
    });
    const loginData = (await loginRes.json()).data || (await loginRes.json());
    const refreshToken = loginData.refreshToken;

    // 2. Gửi refresh token lên /auth/refresh
    const refreshRes = await request.post('http://localhost:4000/api/v1/auth/refresh', {
      data: { refreshToken },
    });

    expect(refreshRes.status()).toBe(200);
    const refreshData = (await refreshRes.json()).data || (await refreshRes.json());
    expect(refreshData.accessToken).toBeDefined();
    expect(refreshData.refreshToken).toBeDefined();
  });

  test('5. Frontend Proxy: Chặn người dùng chưa đăng nhập truy cập trang nội bộ và chuyển về /login', async ({ page, context }) => {
    // Đảm bảo không có cookie xác thực
    await context.clearCookies();

    // Truy cập trực tiếp vào phân hệ quản trị /settings
    await page.goto('http://localhost:3000/settings');

    // Proxy Next.js tự động chuyển hướng về trang /login?redirect=/settings
    await page.waitForURL(/.*\/login\?redirect=%2Fsettings/);
    expect(page.url()).toContain('/login');
    await expect(page.locator('text=Đăng nhập hệ thống')).toBeVisible();
  });

  test('6. Frontend Proxy RBAC: Ngăn chặn Môi giới truy cập trái phép phân hệ Giám đốc (/director)', async ({ page, context }) => {
    // Thiết lập cookie giả lập phiên làm việc của vai trò AGENT
    await context.addCookies([
      {
        name: 'nova_auth_token',
        value: 'mock_agent_token_playwright',
        domain: 'localhost',
        path: '/',
      },
      {
        name: 'nova_auth_role',
        value: 'AGENT',
        domain: 'localhost',
        path: '/',
      },
    ]);

    // Môi giới cố tình gõ link trực tiếp vào /director
    await page.goto('http://localhost:3000/director');

    // Proxy lập tức chặn lại và điều hướng về /agent?unauthorized=director
    await page.waitForURL(/.*\/agent\?unauthorized=director/);
    expect(page.url()).toContain('/agent');

    // Kiểm tra banner cảnh báo bảo mật hiển thị rõ ràng trên giao diện
    await expect(page.locator('text=Hạn chế quyền truy cập phân hệ')).toBeVisible();
  });

  test('7. Frontend Topbar: Hiển thị đúng vai trò và hỗ trợ Chuyển vai trò test RBAC', async ({ page, context }) => {
    // Đăng nhập với quyền SUPER_ADMIN
    await context.addCookies([
      {
        name: 'nova_auth_token',
        value: 'mock_super_admin_token',
        domain: 'localhost',
        path: '/',
      },
      {
        name: 'nova_auth_role',
        value: 'SUPER_ADMIN',
        domain: 'localhost',
        path: '/',
      },
      {
        name: 'nova_auth_user',
        value: encodeURIComponent(JSON.stringify({
          fullName: 'Nguyễn Quản Trị Viên',
          email: 'admin@novacrm.com',
          role: 'SUPER_ADMIN',
        })),
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('http://localhost:3000/agent');
    
    // Kiểm tra tên và huy hiệu vai trò hiển thị trên Topbar
    await expect(page.locator('text=Nguyễn Quản Trị Viên')).toBeVisible();
    await expect(page.locator('text=SUPER_ADMIN').first()).toBeVisible();
  });
});
