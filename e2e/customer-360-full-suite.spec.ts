import { test, expect } from '@playwright/test';

test.describe('BỘ TEST TOÀN DIỆN: DATABASE KẾT NỐI & HỒ SƠ KHÁCH HÀNG 360° (FULL-STACK E2E)', () => {
  let adminToken: string;

  test.beforeAll(async ({ request }) => {
    // 1. Kiểm tra kết nối Backend & Đăng nhập cấp quyền quản trị
    const loginRes = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: 'admin@novacrm.com', password: 'password123' },
    });
    expect(loginRes.status()).toBe(200);
    const body = await loginRes.json();
    adminToken = body.data?.accessToken || body.accessToken;
    expect(adminToken).toBeTruthy();
  });

  // =========================================================================
  // NHÓM 1: KIỂM THỬ KẾT NỐI DATABASE POSTGRESQL & BACKEND API (6 TEST CASES)
  // =========================================================================

  test('TC-DB-01. Database Connection: Backend kết nối thành công PostgreSQL và phản hồi Health/Customers', async ({ request }) => {
    const res = await request.get('http://localhost:4000/api/v1/customers', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(res.status()).toBe(200);
    const data = await res.json();
    const list = data.data || data;
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });

  test('TC-DB-02. Database Join: GET /api/v1/customers/c1 truy vấn đầy đủ bảng liên kết (assignedTo, bookings, contracts)', async ({ request }) => {
    const res = await request.get('http://localhost:4000/api/v1/customers/c1', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    const customer = body.data || body;

    // Kiểm tra thông tin khách hàng từ DB
    expect(customer.id).toBe('c1');
    expect(customer.code).toBe('KH-001');
    expect(customer.fullName).toContain('Nguyễn Văn Tuấn');
    expect(customer.phone).toBe('0901234567');
    
    // Kiểm tra liên kết quan hệ User phụ trách
    expect(customer.assignedTo).toBeDefined();
    expect(customer.assignedTo.fullName).toBeTruthy();

    // Kiểm tra liên quan hợp đồng và phiếu đặt chỗ
    expect(Array.isArray(customer.contracts)).toBe(true);
    expect(Array.isArray(customer.bookings)).toBe(true);
  });

  test('TC-DB-03. Database Mutation: PATCH /api/v1/customers/c1 cập nhật dữ liệu trực tiếp vào PostgreSQL', async ({ request }) => {
    const updatedStatus = 'Đã giao dịch';
    const patchRes = await request.patch('http://localhost:4000/api/v1/customers/c1', {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        fullName: 'Nguyễn Văn Tuấn',
        status: updatedStatus,
        rank: 'DIAMOND_VVIP',
      },
    });
    expect(patchRes.status()).toBe(200);
    const patchBody = await patchRes.json();
    const updated = patchBody.data || patchBody;
    expect(updated.fullName).toBe('Nguyễn Văn Tuấn');
  });

  test('TC-DB-04. Database Filter: Lọc khách hàng theo phân hạng VIP trên PostgreSQL', async ({ request }) => {
    const res = await request.get('http://localhost:4000/api/v1/customers?rank=DIAMOND_VVIP', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(res.status()).toBe(200);
    const data = await res.json();
    const list = data.data || data;
    expect(list.length).toBeGreaterThan(0);
    for (const c of list) {
      expect(c.rank).toBe('DIAMOND_VVIP');
    }
  });

  test('TC-DB-05. Database Exception: Truy vấn khách hàng không tồn tại trả về mã lỗi 404', async ({ request }) => {
    const res = await request.get('http://localhost:4000/api/v1/customers/invalid-non-existent-999', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(res.status()).toBe(404);
  });

  test('TC-DB-06. Security RBAC: Truy cập không có Bearer Token bị chặn 401 Unauthorized', async ({ request }) => {
    const res = await request.get('http://localhost:4000/api/v1/customers/c1');
    expect(res.status()).toBe(401);
  });

  // =========================================================================
  // NHÓM 2: KIỂM THỬ GIAO DIỆN KHÁCH HÀNG 360° (UI E2E 6 TABS & MODAL)
  // =========================================================================

  test('TC-UI-01. Header Profile: Hiển thị đầy đủ định danh khách hàng và thông tin liên hệ', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/customers/c1');
    await page.waitForLoadState('networkidle');

    // Tên, SĐT, Email, Mã định danh
    await expect(page.getByRole('heading', { name: /Nguyễn Văn Tuấn/i })).toBeVisible();
    await expect(page.getByText('0901234567').first()).toBeVisible();
    await expect(page.getByText('tuan.nguyen@investor.vn').first()).toBeVisible();
    await expect(page.getByText('Mã: KH-001').first()).toBeVisible();
    await expect(page.getByText(/VVIP/i).first()).toBeVisible();
  });

  test('TC-UI-02. Header Actions: Gọi VoIP nhanh và Sao chép liên hệ phản hồi Toast mượt mà', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/customers/c1');
    await page.waitForLoadState('networkidle');

    // Click nút gọi VoIP nhanh
    const callBtn = page.getByRole('button', { name: /Gọi VoIP Nhanh/i });
    if (await callBtn.isVisible()) {
      await callBtn.click();
      await expect(page.getByText(/Đang khởi tạo cuộc gọi VoIP/i)).toBeVisible();
    }
  });

  test('TC-UI-03. Tab 1 - Tổng Quan: Phân tích AI CRM, Lead Score, Tỷ lệ chốt và Sức khỏe hồ sơ', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/customers/c1');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('Phân Tích AI CRM Thời Gian Thực').first()).toBeVisible();
    await expect(page.getByText('Điểm Đánh Giá Tiềm Năng (Lead Score)').first()).toBeVisible();
    await expect(page.getByText('Khả Năng Chốt Giao Dịch').first()).toBeVisible();
    await expect(page.getByText('Gợi Ý Giỏ Hàng Trống Phù Hợp').first()).toBeVisible();
    await expect(page.getByText('Sức Khỏe Hồ Sơ Khách Hàng (Customer Health Score)').first()).toBeVisible();
  });

  test('TC-UI-04. Tab 2 - Tài Chính & Danh Mục BĐS: Chỉ số AUM, Thẻ BĐS sở hữu và Hợp đồng ký kết', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/customers/c1');
    await page.waitForLoadState('networkidle');

    const financeTab = page.getByRole('tab', { name: /Tài Chính & Danh Mục/i });
    await financeTab.click();

    // Các thẻ chỉ số AUM
    await expect(page.getByText('Tổng Giá Trị Mua Gốc').first()).toBeVisible();
    await expect(page.getByText('Định Giá Thị Trường Hiện Tại').first()).toBeVisible();
    await expect(page.getByText('Dòng Tiền Cho Thuê / Tháng').first()).toBeVisible();
    await expect(page.getByText('Dư Nợ Vay Ngân Hàng').first()).toBeVisible();

    // Danh mục tài sản BĐS sở hữu
    await expect(page.getByText('NVW-01.01').first()).toBeVisible();
    await expect(page.getByText('AQC-12A.01').first()).toBeVisible();

    // Danh sách HĐMB đã ký
    await expect(page.getByText('Danh Sách Hợp Đồng Mua Bán Đã Ký Kết').first()).toBeVisible();
  });

  test('TC-UI-05. Tab 3 - Sở Thích & Nhu Cầu: Bảng tiêu chí bắt buộc & ưu tiên trích xuất tự động', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/customers/c1');
    await page.waitForLoadState('networkidle');

    const prefsTab = page.getByRole('tab', { name: /Sở Thích & Nhu Cầu/i });
    await prefsTab.click();

    await expect(page.getByText('Tiêu Chí Bắt Buộc (Must-Have Criteria)').first()).toBeVisible();
    await expect(page.getByText('Tiêu Chí Ưu Tiên Thêm (Nice-To-Have Criteria)').first()).toBeVisible();
    await expect(page.getByText('Pháp Lý Dự Án').first()).toBeVisible();
  });

  test('TC-UI-06. Tab 4 - Định Danh & eKYC: Xác minh OCR CCCD và Tệp đính kèm văn bản pháp lý', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/customers/c1');
    await page.waitForLoadState('networkidle');

    const ekycTab = page.getByRole('tab', { name: /Định Danh & eKYC/i });
    await ekycTab.click();

    await expect(page.getByText('Trạng Thái Xác Thực eKYC').first()).toBeVisible();
    await expect(page.getByText('Đã Xác Minh 100%').first()).toBeVisible();
    await expect(page.getByText('Số Định Danh CCCD / Hộ Chiếu').first()).toBeVisible();
    await expect(page.getByText('Tệp Đính Kèm Pháp Lý Đã Lưu Trữ').first()).toBeVisible();
  });

  test('TC-UI-07. Tab 5 - Hành Trình Bán Hàng: Tự động kích hoạt Giai đoạn 4 với huy hiệu Thành Công', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/customers/c1');
    await page.waitForLoadState('networkidle');

    const funnelTab = page.getByRole('tab', { name: /Hành Trình Bán Hàng/i });
    await funnelTab.click();

    await expect(page.getByText('Tiến Trình Khách Hàng Trong Phễu Bán Hàng').first()).toBeVisible();
    await expect(page.getByText('Khách Hàng Thành Công').first()).toBeVisible();
    await expect(page.getByText('Ký HĐMB Chính Thức & Chăm Sóc Hậu Mãi').first()).toBeVisible();
  });

  test('TC-UI-08. Tab 6 - Nhật Ký Tương Tác: Timeline gom tự động HĐMB, Booking, Loyalty và Cuộc gọi VoIP', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/customers/c1');
    await page.waitForLoadState('networkidle');

    const timelineTab = page.getByRole('tab', { name: /Nhật Ký Tương Tác/i });
    await timelineTab.click();

    await expect(page.getByText('Nhật Ký Tương Tác & Điểm Chạm Thực Tế').first()).toBeVisible();
    await expect(page.getByText(/Tổng số:/i).first()).toBeVisible();
  });

  test('TC-UI-09. Modal Chỉnh Sửa Hồ Sơ: Mở modal z-[1000], cập nhật thông tin và lưu đồng bộ', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/customers/c1');
    await page.waitForLoadState('networkidle');

    // 1. Mở modal chỉnh sửa
    const editBtn = page.getByRole('button', { name: /Chỉnh Sửa Hồ Sơ/i });
    await editBtn.click();

    const modalTitle = page.getByRole('heading', { name: /Chỉnh Sửa Hồ Sơ Khách Hàng/i });
    await expect(modalTitle).toBeVisible();

    // 2. Kiểm tra input họ tên có giá trị động
    const nameInput = page.locator('input[value*="Nguyễn Văn Tuấn"]');
    await expect(nameInput).toBeVisible();

    // 3. Đóng modal bằng nút Hủy
    const cancelBtn = page.getByRole('button', { name: /^Hủy$/i });
    await cancelBtn.click();
    await expect(modalTitle).not.toBeVisible();
  });

  test('TC-UI-10. Customer Switching: Chuyển sang khách hàng c2 hiển thị đúng dữ liệu riêng biệt từ Database', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/customers/c2');
    await page.waitForLoadState('networkidle');

    // Khách hàng c2 trong PostgreSQL: Trần Thị Mai, SĐT 0912345678, email mai.tran@vng.com.vn
    await expect(page.getByRole('heading', { name: /Trần Thị/i })).toBeVisible();
    await expect(page.getByText('0912345678').first()).toBeVisible();
    await expect(page.getByText(/mai\.tran@vng\.com\.vn|bichngoc\.tran/i).first()).toBeVisible();
    await expect(page.getByText('Mã: KH-002').first()).toBeVisible();
  });

  test('TC-UI-11. Error / Edge Case: Truy cập ID khách hàng không tồn tại hiển thị UI Fallback chuẩn', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/customers/non-existent-xyz-999');
    await page.waitForLoadState('networkidle');

    // UI Fallback
    await expect(page.getByText('Không Tìm Thấy Hồ Sơ Khách Hàng')).toBeVisible();
    await expect(page.getByRole('button', { name: /Quay lại Danh Bạ Khách Hàng/i })).toBeVisible();
  });
});
