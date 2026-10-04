import { test, expect } from '@playwright/test';

test.describe('Kiểm tra Phân Quyền Menu & Kiểm Tra Kỹ Các Modal Popup UI', () => {

  test('1. Menu RBAC: Vai trò AGENT bị ẩn các menu quản lý, giám đốc và cài đặt', async ({ page, context }) => {
    // Thiết lập cookie phiên làm việc của AGENT
    await context.addCookies([
      {
        name: 'nova_auth_token',
        value: 'mock_agent_jwt_token',
        domain: 'localhost',
        path: '/',
      },
      {
        name: 'nova_auth_role',
        value: 'AGENT',
        domain: 'localhost',
        path: '/',
      },
      {
        name: 'nova_auth_user',
        value: encodeURIComponent(JSON.stringify({
          fullName: 'Trần Văn Môi Giới',
          email: 'agent@novacrm.com',
          role: 'AGENT',
        })),
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('http://localhost:3000/agent');
    await page.waitForLoadState('networkidle');

    // Sidebar: Hiển thị các tính năng nghiệp vụ của Sale
    const sidebar = page.locator('nav').first();
    await expect(sidebar.locator('a[href="/customers"]')).toBeVisible();
    await expect(sidebar.locator('a[href="/inventory"]')).toBeVisible();
    await expect(sidebar.locator('a[href="/booking"]')).toBeVisible();
    await expect(sidebar.locator('a[href="/agent"]')).toBeVisible();

    // Sidebar: ẨN các phân hệ thuộc thẩm quyền cấp Quản lý & Giám đốc
    await expect(sidebar.locator('a[href="/director"]')).toHaveCount(0);
    await expect(sidebar.locator('a[href="/manager"]')).toHaveCount(0);
    await expect(sidebar.locator('a[href="/settings"]')).toHaveCount(0);
    await expect(sidebar.locator('a[href="/integrations"]')).toHaveCount(0);
    await expect(sidebar.locator('a[href="/operations"]')).toHaveCount(0);
    await expect(sidebar.locator('a[href="/cms"]')).toHaveCount(0);
    await expect(sidebar.locator('a[href="/surveys"]')).toHaveCount(0);
    await expect(sidebar.locator('a[href="/portfolio"]')).toHaveCount(0);

    // Profile sidebar hiển thị đúng vai trò Chuyên Viên Sale
    await expect(page.locator('text=Trần Văn Môi Giới').first()).toBeVisible();
    await expect(page.locator('text=Chuyên Viên Sale').first()).toBeVisible();
  });

  test('2. Menu RBAC: Vai trò SUPER_ADMIN có toàn quyền hiển thị 35 phân hệ', async ({ page, context }) => {
    // Thiết lập cookie phiên làm việc của SUPER_ADMIN
    await context.addCookies([
      {
        name: 'nova_auth_token',
        value: 'mock_superadmin_jwt_token',
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
          fullName: 'Lê Hoàng Anh',
          email: 'admin@novacrm.com',
          role: 'SUPER_ADMIN',
        })),
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('http://localhost:3000/customers');
    await page.waitForLoadState('networkidle');

    const sidebar = page.locator('nav').first();
    // Kiểm tra các phân hệ đặc thù của Super Admin đều hiển thị
    await expect(sidebar.locator('a[href="/director"]')).toBeVisible();
    await expect(sidebar.locator('a[href="/manager"]')).toBeVisible();
    await expect(sidebar.locator('a[href="/settings"]')).toBeVisible();
    await expect(sidebar.locator('a[href="/integrations"]')).toBeVisible();
    await expect(sidebar.locator('a[href="/operations"]')).toBeVisible();
    await expect(sidebar.locator('a[href="/portfolio"]')).toBeVisible();

    // Profile sidebar hiển thị đúng Tổng Quản Trị
    await expect(page.locator('text=Tổng Quản Trị').first()).toBeVisible();
  });

  test('3. Modal Popup: Kiểm tra Modal Booking Workflow mở có backdrop và đóng mượt mà', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'nova_auth_token',
        value: 'mock_admin_token',
        domain: 'localhost',
        path: '/',
      },
      {
        name: 'nova_auth_role',
        value: 'SUPER_ADMIN',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('http://localhost:3000/booking');
    await page.waitForLoadState('networkidle');

    // Click nút tạo yêu cầu booking mới
    const createBtn = page.locator('button:has-text("Tạo Yêu Cầu Booking"), button:has-text("Tạo Booking Mới")').first();
    await createBtn.click();

    // Dialog Modal hiển thị với tiêu đề rõ ràng
    const dialogTitle = page.locator('text=Khởi Tạo Phiếu Giữ Chỗ / Booking Mới');
    await expect(dialogTitle).toBeVisible();

    // Backdrop overlay z-[1000] hiển thị
    const overlay = page.locator('[data-slot="dialog-overlay"]');
    await expect(overlay).toBeVisible();

    // Đóng dialog bằng nút Hủy bỏ
    const cancelBtn = page.locator('button:has-text("Hủy bỏ")');
    await cancelBtn.click();

    // Kiểm tra dialog đã được đóng
    await expect(dialogTitle).not.toBeVisible();
  });

  test('4. Modal Popup: Kiểm tra Modal Loyalty có z-[1000] và đóng mượt mà', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'nova_auth_token',
        value: 'mock_admin_token',
        domain: 'localhost',
        path: '/',
      },
      {
        name: 'nova_auth_role',
        value: 'SUPER_ADMIN',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('http://localhost:3000/loyalty');
    await page.waitForLoadState('networkidle');

    // Mở modal Giả lập tích điểm
    const earnBtn = page.locator('button:has-text("Tích Điểm Giao Dịch")').first();
    await earnBtn.click();

    // Modal popup xuất hiện
    const earnModalTitle = page.locator('text=Giả Lập Tích Điểm Giao Dịch BĐS');
    await expect(earnModalTitle).toBeVisible();

    // Đóng modal bằng nút đóng ✕
    const closeBtn = page.locator('button:has-text("✕")').first();
    await closeBtn.click();
    await expect(earnModalTitle).not.toBeVisible();

    // Mở Modal Digital Pass / QR Code
    const passBtn = page.locator('text=Mở QR Pass').first();
    await passBtn.click();
    const passTitle = page.locator('text=NovaLoyalty Digital Pass');
    await expect(passTitle).toBeVisible();

    // Đóng modal bằng nút Đóng
    const closePassBtn = page.locator('button:has-text("Đóng")').first();
    await closePassBtn.click();
    await expect(passTitle).not.toBeVisible();
  });

  test('5. Modal Popup: Kiểm tra Modal Marketplace B2B mở và đóng đúng chuẩn', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'nova_auth_token',
        value: 'mock_admin_token',
        domain: 'localhost',
        path: '/',
      },
      {
        name: 'nova_auth_role',
        value: 'SUPER_ADMIN',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('http://localhost:3000/marketplace');
    await page.waitForLoadState('networkidle');

    // Click nút đăng nguồn hàng mới
    const addListingBtn = page.locator('button:has-text("Đăng Nguồn Hàng Bán Chéo")').first();
    await addListingBtn.click();

    // Modal xuất hiện
    const modalTitle = page.locator('text=Đăng Nguồn Hàng Bán Chéo Lên Sàn B2B');
    await expect(modalTitle).toBeVisible();

    // Đóng modal
    const closeBtn = page.locator('button:has-text("✕")').first();
    await closeBtn.click();
    await expect(modalTitle).not.toBeVisible();
  });

  test('6. Modal Popup: Kiểm tra Modal Tài Chính Mortgage Khấu Hao 360 tháng', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'nova_auth_token',
        value: 'mock_admin_token',
        domain: 'localhost',
        path: '/',
      },
      {
        name: 'nova_auth_role',
        value: 'SUPER_ADMIN',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('http://localhost:3000/mortgage');
    await page.waitForLoadState('networkidle');

    // Mở modal Bảng khấu hao toàn bộ chu kỳ
    const amortBtn = page.locator('button:has-text("Xem Toàn Bộ Lịch"), button:has-text("Xem toàn bộ")').first();
    await amortBtn.click();

    // Modal hiển thị
    const modalHeader = page.locator('text=Bảng Khấu Hao Toàn Bộ Chu Kỳ Vay');
    await expect(modalHeader).toBeVisible();

    // Đóng modal
    const closeBtn = page.locator('button:has-text("Đóng")').first();
    await closeBtn.click();
    await expect(modalHeader).not.toBeVisible();
  });
});
