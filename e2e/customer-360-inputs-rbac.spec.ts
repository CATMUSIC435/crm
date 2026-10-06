import { test, expect } from '@playwright/test';

test.describe('LUỒNG NHẬP DỮ LIỆU & PHÂN QUYỀN CHUẨN TRÊN HỒ SƠ KHÁCH HÀNG 360°', () => {
  let adminToken: string;
  let agentToken: string;

  test.beforeAll(async ({ request }) => {
    // 1. Lấy Token Quản Trị Viên (SUPER_ADMIN)
    const adminRes = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: 'admin@novacrm.com', password: 'password123' },
    });
    expect(adminRes.status()).toBe(200);
    const adminBody = await adminRes.json();
    adminToken = adminBody.data?.accessToken || adminBody.accessToken;

    // 2. Tạo hoặc đăng nhập tài khoản Môi Giới (AGENT) để test phân quyền RBAC
    const agentEmail = `agent.rbac.${Date.now()}@novacrm.com`;
    const regRes = await request.post('http://localhost:4000/api/v1/auth/register', {
      data: {
        email: agentEmail,
        password: 'password123',
        fullName: 'Nguyễn Văn Môi Giới (Agent)',
        phone: '09' + Math.floor(10000000 + Math.random() * 90000000),
      },
    });
    expect(regRes.status()).toBe(201);
    const regBody = await regRes.json();
    agentToken = regBody.data?.accessToken || regBody.accessToken;
  });

  // =========================================================================
  // PHẦN 1: CÁC LUỒNG NHẬP LIỆU TRÊN CÁC TAB (DATA INPUT WORKFLOWS)
  // =========================================================================

  test('INPUT-01. Tab 6: Nhập ghi chú tương tác / điểm chạm mới -> Render tức thì trên Timeline & Toast feedback', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/customers/c1');
    await page.waitForLoadState('networkidle');

    // Chuyển sang Tab 6: Nhật Ký Tương Tác
    const timelineTab = page.getByRole('tab', { name: /Nhật Ký Tương Tác/i });
    await timelineTab.click();

    // Kiểm tra form nhập dữ liệu điểm chạm
    await expect(page.getByText('Thêm Ghi Chú Tương Tác & Điểm Chạm Chăm Sóc Mới (Form Nhập Dữ Liệu)')).toBeVisible();

    // Điền form tương tác mới
    const testTitle = `Hẹn gặp tham quan Biệt thự Florida - ${Date.now().toString().slice(-4)}`;
    const testDesc = 'Khách hàng có mặt tại dự án lúc 9h sáng thứ Bảy, cần chuẩn bị xe đưa đón và bảng tính vay MBBank.';
    
    await page.locator('input[placeholder*="Hẹn khách tham quan"]').fill(testTitle);
    await page.locator('input[placeholder*="Ghi nhận phản hồi"]').fill(testDesc);

    // Bấm nút Lưu Ghi Chú
    const saveNoteBtn = page.getByRole('button', { name: /Lưu Ghi Chú Tương Tác/i });
    await saveNoteBtn.click();

    // 1. Toast thông báo hiển thị
    await expect(page.getByText(/Đã lưu ghi chú tương tác mới vào dòng thời gian/i)).toBeVisible();

    // 2. Điểm chạm mới xuất hiện ngay trên dòng thời gian (Timeline)
    await expect(page.getByText(testTitle).first()).toBeVisible();
    await expect(page.getByText(testDesc).first()).toBeVisible();
  });

  test('INPUT-02. Tab 3: Nhập bổ sung tiêu chí nhu cầu đầu tư (Must-Have & Nice-To-Have) -> Hiển thị lập tức', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/customers/c1');
    await page.waitForLoadState('networkidle');

    // Chuyển sang Tab 3: Sở Thích & Nhu Cầu
    const prefsTab = page.getByRole('tab', { name: /Sở Thích & Nhu Cầu/i });
    await prefsTab.click();

    await expect(page.getByText('Bổ Sung Tiêu Chí Nhu Cầu Đầu Tư Mới (Form Nhập Dữ Liệu)')).toBeVisible();

    // 1. Nhập tiêu chí Bắt buộc (Must-Have)
    const uniqueSuffix = Date.now().toString().slice(-4);
    const mustTitle = `Tiêu chuẩn view trực diện Biển (${uniqueSuffix})`;
    const mustDesc = 'Căn biệt thự phải có ban công tầng 2 nhìn thẳng bãi biển Tiến Thành.';

    await page.locator('input[placeholder*="Ngân sách tối đa, Hướng"]').fill(mustTitle);
    await page.locator('input[placeholder*="Mô tả chi tiết nhu cầu"]').fill(mustDesc);

    const saveCriteriaBtn = page.getByRole('button', { name: /Lưu Tiêu Chí/i });
    await saveCriteriaBtn.click();

    // Toast feedback & Hiển thị ngay trong danh sách tiêu chí bắt buộc
    await expect(page.getByText(/Đã lưu tiêu chí nhu cầu đầu tư mới/i)).toBeVisible();
    await expect(page.getByText(mustTitle).first()).toBeVisible();
    await expect(page.getByText(mustDesc).first()).toBeVisible();
  });

  // =========================================================================
  // PHẦN 2: PHÂN QUYỀN CHUẨN (RBAC ENFORCEMENT - ADMIN VS AGENT)
  // =========================================================================

  test('RBAC-01. Cấp Quản Lý (SUPER_ADMIN): Có toàn quyền điều phối và thay đổi Chuyên viên phụ trách', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/customers/c1');
    await page.waitForLoadState('networkidle');

    // Kiểm tra header hiển thị badge vai trò SUPER_ADMIN
    await expect(page.getByText('Vai trò: SUPER_ADMIN')).toBeVisible();

    // Mở Modal Chỉnh Sửa Hồ Sơ
    const editBtn = page.getByRole('button', { name: /Chỉnh Sửa Hồ Sơ/i });
    await editBtn.click();

    // Dropdown chuyên viên phụ trách KHÔNG bị disabled đối với cấp Quản Lý
    const assignedSelect = page.locator('div[role="dialog"] button[data-slot="select-trigger"]').last();
    await expect(assignedSelect).toBeEnabled();
    await expect(page.getByText(/Khóa phân quyền/i)).not.toBeVisible();

    // Đóng modal
    await page.getByRole('button', { name: /^Hủy$/i }).click();
  });

  test('RBAC-02. Cấp Môi Giới (AGENT): Khóa trường Chuyên viên phụ trách trên UI và hiển thị cảnh báo phân quyền', async ({ page, context }) => {
    // Thiết lập cookie phiên làm việc của vai trò AGENT
    await context.addCookies([
      { name: 'nova_auth_token', value: agentToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'AGENT', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Nguyễn Văn Môi Giới', role: 'AGENT' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/customers/c1');
    await page.waitForLoadState('networkidle');

    // Kiểm tra header hiển thị badge vai trò AGENT
    await expect(page.getByText('Vai trò: AGENT')).toBeVisible();

    // Mở Modal Chỉnh Sửa Hồ Sơ
    const editBtn = page.getByRole('button', { name: /Chỉnh Sửa Hồ Sơ/i });
    await editBtn.click();

    // Trường Chuyên viên phụ trách BỊ KHÓA đối với AGENT
    await expect(page.getByText('🔒 Khóa phân quyền (Chỉ Leader/Admin)')).toBeVisible();
    await expect(page.getByText(/Chuyên viên môi giới không được phép tự ý chuyển giao khách hàng/i)).toBeVisible();

    // Selector chuyên viên phụ trách bị disabled
    const disabledTrigger = page.locator('div[role="dialog"] button[data-slot="select-trigger"]').last();
    await expect(disabledTrigger).toBeDisabled();

    // Đóng modal
    await page.getByRole('button', { name: /^Hủy$/i }).click();
  });

  test('RBAC-03. Backend API RBAC: Chặn yêu cầu PATCH chuyển giao khách hàng trái phép từ AGENT (403 Forbidden)', async ({ request }) => {
    // AGENT cố tình gửi PATCH để đổi assignedToId sang người khác
    const unauthorizedPatchRes = await request.patch('http://localhost:4000/api/v1/customers/c1', {
      headers: {
        Authorization: `Bearer ${agentToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        assignedToId: 'usr-unauthorized-target-009',
      },
    });

    // Bắt buộc phải bị từ chối 403 Forbidden theo quy tắc phân quyền chặt chẽ!
    expect(unauthorizedPatchRes.status()).toBe(403);
    const resBody = await unauthorizedPatchRes.text();
    expect(resBody).toContain('Chuyên viên môi giới (AGENT) không được phép tự ý chuyển giao khách hàng');
  });
});
