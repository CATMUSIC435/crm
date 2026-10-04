import { test, expect } from '@playwright/test';

test.describe('Kiểm tra kết nối Full-Stack NOVA CRM (Frontend Next.js <-> Backend NestJS)', () => {
  
  test('1. Máy chủ Frontend Next.js (Port 3000) phản hồi và hiển thị trang Đăng Nhập', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/');
    expect(response?.status()).toBe(200);

    // Kiểm tra logo thương hiệu và tiêu đề form đăng nhập
    await expect(page.locator('text=NOVA').first()).toBeVisible();
    await expect(page.locator('text=Đăng nhập hệ thống')).toBeVisible();

    // Kiểm tra trường nhập email và mật khẩu
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();
  });

  test('2. Máy chủ Backend NestJS (Port 4000) hoạt động và phục vụ tài liệu Swagger OpenAPI', async ({ page }) => {
    const response = await page.goto('http://localhost:4000/api/docs');
    expect(response?.status()).toBe(200);

    // Xác thực tài liệu Swagger tải thành công
    await expect(page).toHaveTitle(/NOVA CRM - API Documentation/);
  });

  test('3. Kết nối API Backend trực tiếp: Kiểm tra Webhook Đối Soát VietQR IPN', async ({ request }) => {
    const testPayload = {
      transactionId: 'TEST_PLAYWRIGHT_' + Date.now(),
      amount: 50000000,
      content: 'NGUYEN VAN A CHUYEN TIEN COC BK-1001',
      bankCode: 'MB',
      accountNumber: '0901234567',
    };

    const res = await request.post('http://localhost:4000/api/v1/payments/vietqr-ipn', {
      data: testPayload,
    });

    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    const message = json.data?.message || json.message;
    expect(message).toContain('Đã xử lý thông báo IPN VietQR thành công');
  });

  test('4. Cầu nối Reverse Proxy (Next.js rewrites) kết nối thông suốt tới NestJS API', async ({ request }) => {
    // Next.js tự động chuyển tiếp /backend-api/* sang http://localhost:4000/api/v1/*
    const res = await request.post('http://localhost:3000/backend-api/payments/vietqr-ipn', {
      data: {
        transactionId: 'PROXY_TEST_' + Date.now(),
        amount: 100000000,
        content: 'CHUYEN TIEN COC THE GLOBAL CITY BK-1001',
        bankCode: 'TCB',
        accountNumber: '190333444555',
      },
    });

    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  test('5. Quy trình Đăng nhập E2E: Người dùng đăng nhập và được chuyển hướng vào Dashboard Agent', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // Điền thông tin đăng nhập
    await page.fill('input[type="email"]', 'admin@novacrm.com');
    await page.fill('input[type="password"]', 'password123');

    // Nhấn nút đăng nhập
    await page.click('button[type="submit"]');

    // Chờ thông báo chuyển hướng và điều hướng vào bảng điều khiển /agent
    await page.waitForURL('**/agent', { timeout: 15000 });
    expect(page.url()).toContain('/agent');

    // Kiểm tra giao diện Dashboard hiển thị đầy đủ
    await page.waitForLoadState('networkidle');
    expect(await page.title()).toBeDefined();
  });
});
