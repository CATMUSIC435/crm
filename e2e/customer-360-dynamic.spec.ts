import { test, expect } from '@playwright/test';

test.describe('Customer 360 Detail Page (/customers/c1) - Dữ Liệu Động Toàn Diện', () => {
  let adminToken: string;

  test.beforeAll(async ({ request }) => {
    const adminLoginRes = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: 'admin@novacrm.com', password: 'password123' },
    });
    expect(adminLoginRes.status()).toBe(200);
    const body = await adminLoginRes.json();
    adminToken = body.data?.accessToken || body.accessToken;
  });

  test('Kiểm tra trang /customers/c1 render đầy đủ 6 tabs động và tương tác Modal Chỉnh Sửa', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    // 1. Điều hướng trực tiếp đến trang hồ sơ khách hàng c1
    await page.goto('http://localhost:3000/customers/c1');
    await page.waitForLoadState('networkidle');

    // 2. Header Customer Profile động
    await expect(page.getByRole('heading', { name: /Nguyễn Văn Tuấn/i })).toBeVisible();
    await expect(page.getByText('0901234567').first()).toBeVisible();
    await expect(page.getByText('tuan.nguyen@investor.vn').first()).toBeVisible();
    await expect(page.getByText('Mã: KH-001').first()).toBeVisible();

    // Nút "Chỉnh Sửa Hồ Sơ" có mặt trên header
    const editBtn = page.getByRole('button', { name: /Chỉnh Sửa Hồ Sơ/i });
    await expect(editBtn).toBeVisible();

    // 3. Tab 1: Tổng Quan (Mặc định active)
    await expect(page.getByText('Phân Tích AI CRM Thời Gian Thực').first()).toBeVisible();
    await expect(page.getByText('Điểm Đánh Giá Tiềm Năng (Lead Score)').first()).toBeVisible();
    await expect(page.getByText('Khả Năng Chốt Giao Dịch').first()).toBeVisible();
    await expect(page.getByText('Gợi Ý Giỏ Hàng Trống Phù Hợp').first()).toBeVisible();
    await expect(page.getByText('Sức Khỏe Hồ Sơ Khách Hàng').first()).toBeVisible();

    // 4. Tab 2: Tài Chính & Danh Mục BĐS
    const financeTab = page.getByRole('tab', { name: /Tài Chính & Danh Mục/i });
    await financeTab.click();
    await expect(page.getByText('Tổng Giá Trị Mua Gốc').first()).toBeVisible();
    await expect(page.getByText('Định Giá Thị Trường Hiện Tại').first()).toBeVisible();
    await expect(page.getByText('Dòng Tiền Cho Thuê / Tháng').first()).toBeVisible();
    // Card BĐS sở hữu từ store
    await expect(page.getByText('NVW-01.01').first()).toBeVisible();
    await expect(page.getByText('AQC-12A.01').first()).toBeVisible();

    // 5. Tab 3: Sở Thích & Nhu Cầu
    const prefsTab = page.getByRole('tab', { name: /Sở Thích & Nhu Cầu/i });
    await prefsTab.click();
    await expect(page.getByText('Tiêu Chí Bắt Buộc (Must-Have Criteria)').first()).toBeVisible();
    await expect(page.getByText('Tiêu Chí Ưu Tiên Thêm (Nice-To-Have Criteria)').first()).toBeVisible();

    // 6. Tab 4: Định Danh & eKYC
    const ekycTab = page.getByRole('tab', { name: /Định Danh & eKYC/i });
    await ekycTab.click();
    await expect(page.getByText('Trạng Thái Xác Thực eKYC').first()).toBeVisible();
    await expect(page.getByText('Số Định Danh CCCD / Hộ Chiếu').first()).toBeVisible();
    await expect(page.getByText('Tệp Đính Kèm Pháp Lý Đã Lưu Trữ').first()).toBeVisible();

    // 7. Tab 5: Hành Trình Bán Hàng
    const funnelTab = page.getByRole('tab', { name: /Hành Trình Bán Hàng/i });
    await funnelTab.click();
    await expect(page.getByText('Tiến Trình Khách Hàng Trong Phễu Bán Hàng').first()).toBeVisible();
    await expect(page.getByText('Khách Hàng Thành Công').first()).toBeVisible();

    // 8. Tab 6: Nhật Ký Tương Tác
    const timelineTab = page.getByRole('tab', { name: /Nhật Ký Tương Tác/i });
    await timelineTab.click();
    await expect(page.getByText('Nhật Ký Tương Tác & Điểm Chạm Thực Tế').first()).toBeVisible();

    // 9. Kiểm tra Modal Chỉnh Sửa Hồ Sơ hoạt động với z-[1000]
    await editBtn.click();
    const modalTitle = page.getByRole('heading', { name: /Chỉnh Sửa Hồ Sơ Khách Hàng/i });
    await expect(modalTitle).toBeVisible();

    // Đóng modal bằng nút Hủy
    const cancelBtn = page.getByRole('button', { name: /^Hủy$/i });
    await cancelBtn.click();
    await expect(modalTitle).not.toBeVisible();
  });
});
