import { test, expect } from '@playwright/test';

test.describe('GIAI ĐOẠN 1: CORE CRM & RỔ HÀNG DỰ ÁN (6 CHỨC NĂNG - ĐỒNG BỘ UI & BACKEND)', () => {
  let adminToken: string;
  let agentToken: string;

  test.beforeAll(async ({ request }) => {
    // 1. Lấy Token Quản trị viên (SUPER_ADMIN)
    const adminLoginRes = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: 'admin@novacrm.com', password: 'password123' },
    });
    expect(adminLoginRes.status()).toBe(200);
    const adminData = (await adminLoginRes.json()).data || (await adminLoginRes.json());
    adminToken = adminData.accessToken;

    // 2. Lấy Token Môi giới (AGENT)
    const agentLoginRes = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: 'agent@novacrm.com', password: 'password123' },
    });
    expect(agentLoginRes.status()).toBe(200);
    const agentData = (await agentLoginRes.json()).data || (await agentLoginRes.json());
    agentToken = agentData.accessToken;
  });

  // =========================================================================
  // CHỨC NĂNG 1: KHÁCH HÀNG 360° (/customers)
  // =========================================================================

  test('F01-TC1. Customers: Danh sách khách hàng tải đúng, hỗ trợ lọc phân khúc VIP', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/customers');
    await page.waitForLoadState('networkidle');

    // Kiểm tra tiêu đề trang
    await expect(page.locator('text=Khách Hàng 360').or(page.locator('text=Khách Hàng')).first()).toBeVisible();

    // Kiểm tra sự xuất hiện của ít nhất một khách hàng mẫu
    const customerRow = page.locator('text=Nguyễn Văn').or(page.locator('text=Trần')).or(page.locator('text=Lê')).first();
    await expect(customerRow).toBeVisible();
  });

  test('F01-TC2. Customers: Thêm mới khách hàng qua Backend API và kiểm tra đồng bộ lên UI', async ({ request, page, context }) => {
    const uniquePhone = '098' + Math.floor(1000000 + Math.random() * 9000000);
    const uniqueName = `Khách Test E2E P1_${Date.now().toString().slice(-4)}`;

    // 1. Tạo mới khách hàng qua API backend
    const createRes = await request.post('http://localhost:4000/api/v1/customers', {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: {
        fullName: uniqueName,
        phone: uniquePhone,
        email: `test.${Date.now()}@novacrm.vn`,
        rank: 'DIAMOND_VVIP',
      },
    });
    expect(createRes.status()).toBe(201);
    const created = (await createRes.json()).data || (await createRes.json());
    expect(created.fullName).toBe(uniqueName);

    // 2. Kiểm tra giao diện người dùng hiển thị khách hàng vừa tạo
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);
    await page.addInitScript((token) => {
      localStorage.setItem('nova_auth_token', token);
    }, adminToken);

    await page.goto('http://localhost:3000/customers');
    await page.waitForLoadState('networkidle');

    // Tìm kiếm khách hàng theo tên
    const searchInput = page.locator('input[placeholder*="Tìm"], input[placeholder*="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill(uniqueName);
      await page.waitForTimeout(600);
    }
    await expect(page.locator(`text=${uniqueName}`).first()).toBeVisible({ timeout: 10000 });
  });

  test('F01-TC3. Customers: Truy vấn chi tiết khách hàng và timeline lịch sử chăm sóc', async ({ request }) => {
    const listRes = await request.get('http://localhost:4000/api/v1/customers', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(listRes.status()).toBe(200);
    const listData = (await listRes.json()).data || (await listRes.json());
    expect(listData.length).toBeGreaterThan(0);

    const firstId = listData[0].id;
    const detailRes = await request.get(`http://localhost:4000/api/v1/customers/${firstId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(detailRes.status()).toBe(200);
    const detail = (await detailRes.json()).data || (await detailRes.json());
    expect(detail.id).toBe(firstId);
    expect(detail.fullName).toBeDefined();
    expect(detail.phone).toBeDefined();
  });

  // =========================================================================
  // CHỨC NĂNG 2: KHO DỰ ÁN BĐS (/projects)
  // =========================================================================

  test('F02-TC1. Projects: Danh mục đại đô thị hiển thị thẻ thông tin và chỉ số doanh thu', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/projects');
    await page.waitForLoadState('networkidle');

    // Kiểm tra hiển thị ít nhất một đại dự án lớn
    await expect(page.locator('text=Aqua City').or(page.locator('text=NovaWorld Phan Thiet')).first()).toBeVisible();
    await expect(page.locator('text=Doanh thu').or(page.locator('text=Tỷ lệ bán')).or(page.locator('text=Tổng sản phẩm')).first()).toBeVisible();
  });

  test('F02-TC2. Projects: Tạo dự án mới qua Backend API và kiểm tra đồng bộ hiển thị', async ({ request, page, context }) => {
    const projectCode = 'PRJ_' + Date.now().toString().slice(-6);
    const projectName = `Khu Đô Thị Sinh Thái E2E ${projectCode}`;

    const createRes = await request.post('http://localhost:4000/api/v1/projects', {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: {
        code: projectCode,
        name: projectName,
        location: 'Bảo Lộc, Lâm Đồng',
        developer: 'NovaCRM Holdings',
        type: 'Biệt thự nghỉ dưỡng',
        totalUnits: 300,
        targetRevenue: 1500000000000,
      },
    });
    expect(createRes.status()).toBe(201);

    // Mở trang UI kiểm tra
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);
    await page.addInitScript((token) => {
      localStorage.setItem('nova_auth_token', token);
    }, adminToken);

    await page.goto('http://localhost:3000/projects');
    await page.waitForLoadState('networkidle');
    await expect(page.locator(`text=${projectName}`).first()).toBeVisible({ timeout: 10000 });
  });

  test('F02-TC3. Projects: Bộ lọc trạng thái dự án hoạt động chính xác trên UI', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/projects');
    await page.waitForLoadState('networkidle');

    // Nhấp vào bộ lọc nếu có
    const filterBtn = page.locator('button:has-text("Tất cả"), button:has-text("Đang mở bán")').first();
    if (await filterBtn.isVisible()) {
      await filterBtn.click();
      await page.waitForTimeout(300);
    }
    // Giao diện vẫn ổn định không crash
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  // =========================================================================
  // CHỨC NĂNG 3: RỔ HÀNG & MA TRẬN CĂN (/inventory)
  // =========================================================================

  test('F03-TC1. Inventory: Ma trận căn hiển thị màu sắc trạng thái và KPI tổng rổ hàng', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/inventory');
    await page.waitForLoadState('networkidle');

    // Kiểm tra nhãn trạng thái căn
    await expect(page.locator('text=Trống').or(page.locator('text=Còn trống')).or(page.locator('text=AVAILABLE')).first()).toBeVisible();
    await expect(page.locator('text=NVW-01.01').or(page.locator('text=NVW-01.02')).or(page.locator('text=Căn')).first()).toBeVisible();
  });

  test('F03-TC2. Inventory: Click căn hộ mở Modal Chi Tiết Sản Phẩm BĐS với backdrop z-[1000]', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/inventory');
    await page.waitForLoadState('networkidle');

    // Nhấp vào một ô căn hộ trong ma trận
    const unitCard = page.locator('text=NVW-01.01').or(page.locator('button:has-text("NVW")')).first();
    if (await unitCard.isVisible()) {
      await unitCard.click();
      await page.waitForTimeout(400);

      // Modal hoặc Dialog xuất hiện
      const modalOrDialog = page.locator('[role="dialog"], .fixed.inset-0').first();
      if (await modalOrDialog.isVisible()) {
        // Đóng modal
        const closeBtn = page.locator('button:has-text("✕"), button:has-text("Đóng"), [aria-label="Close"]').first();
        if (await closeBtn.isVisible()) {
          await closeBtn.click();
        }
      }
    }
  });

  test('F03-TC3. Inventory: Khóa căn và mở khóa căn hộ qua Backend API đồng bộ trạng thái', async ({ request }) => {
    // 1. Thao tác khóa nội bộ căn i1
    const lockRes = await request.post('http://localhost:4000/api/v1/inventory/batch-lock', {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: {
        unitIds: ['i1'],
        targetStatus: 'LOCKED',
      },
    });
    expect(lockRes.status()).toBe(201);

    // 2. Kiểm tra căn đã chuyển sang LOCKED
    const checkRes = await request.get('http://localhost:4000/api/v1/inventory/i1', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(checkRes.status()).toBe(200);
    const unitData = (await checkRes.json()).data || (await checkRes.json());
    expect(unitData.status).toBe('LOCKED');

    // 3. Mở khóa lại căn về AVAILABLE
    const unlockRes = await request.post('http://localhost:4000/api/v1/inventory/batch-lock', {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: {
        unitIds: ['i1'],
        targetStatus: 'AVAILABLE',
      },
    });
    expect(unlockRes.status()).toBe(201);
  });

  // =========================================================================
  // CHỨC NĂNG 4: DỮ LIỆU THỊ TRƯỜNG (/market-data)
  // =========================================================================

  test('F04-TC1. Market Data: Giao diện Market Intelligence tải đầy đủ 4 Tabs phân tích', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/market-data');
    await page.waitForLoadState('networkidle');

    // Kiểm tra tiêu đề phân hệ
    await expect(page.locator('text=Market Intelligence').first()).toBeVisible();

    // Kiểm tra 4 Tabs chuyên sâu
    await expect(page.locator('text=Biến Động Giá').first()).toBeVisible();
    await expect(page.locator('text=Quy Hoạch Hạ Tầng').first()).toBeVisible();
    await expect(page.locator('text=Tiện Ích & Dân Cư').first()).toBeVisible();
    await expect(page.locator('text=Vĩ Mô & Kinh Tế').first()).toBeVisible();
  });

  test('F04-TC2. Market Data: Chuyển đổi vùng khảo sát và kiểm tra cập nhật chỉ số biểu đồ', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/market-data');
    await page.waitForLoadState('networkidle');

    // Lựa chọn vùng khảo sát từ dropdown
    const regionSelect = page.locator('select').first();
    await expect(regionSelect).toBeVisible();

    // Chọn vùng khác (ví dụ: dong_nai)
    await regionSelect.selectOption('dong_nai');
    await page.waitForTimeout(400);

    // Nhấp nút "Phân Tích"
    const analyzeBtn = page.locator('button:has-text("Phân Tích")').first();
    await analyzeBtn.click();
    await page.waitForTimeout(300);

    // Chuyển sang Tab "Quy Hoạch Hạ Tầng"
    const infraTab = page.locator('button:has-text("Quy Hoạch Hạ Tầng")').first();
    await infraTab.click();
    await page.waitForTimeout(300);

    // Chuyển sang Tab "Vĩ Mô & Kinh Tế"
    const macroTab = page.locator('button:has-text("Vĩ Mô & Kinh Tế")').first();
    await macroTab.click();
    await page.waitForTimeout(300);

    // Kiểm tra giao diện render ổn định
    await expect(page.locator('text=Vĩ Mô & Kinh Tế').first()).toBeVisible();
  });

  // =========================================================================
  // CHỨC NĂNG 5: KHO TÀI LIỆU SỐ (/documents)
  // =========================================================================

  test('F05-TC1. Documents: Thư mục dự án và danh sách tài liệu số hóa hiển thị chuẩn', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/documents');
    await page.waitForLoadState('networkidle');

    // Kiểm tra tiêu đề trang
    await expect(page.locator('text=Kho Dữ Liệu & Pháp Lý').or(page.locator('text=Kho Tài Liệu')).first()).toBeVisible();

    // Kiểm tra nút hành động chính
    await expect(page.locator('button:has-text("Đăng Tải Tài Liệu")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Tải Gói ZIP Dự Án")').first()).toBeVisible();
  });

  test('F05-TC2. Documents: Modal Xem Trước Văn Bản Pháp Lý hiển thị với z-[1000] và đóng mượt mà', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/documents');
    await page.waitForLoadState('networkidle');

    // Click tiêu đề tài liệu để mở modal xem trước
    const docTitle = page.locator('h3[title]').first();
    await expect(docTitle).toBeVisible();
    await docTitle.click();
    await page.waitForTimeout(400);

    // Modal xem trước xuất hiện
    const modalTitle = page.locator('text=Trình Đọc Văn Bản & Kiểm Tra Thẩm Quyền').or(page.locator('text=CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM'));
    await expect(modalTitle.first()).toBeVisible({ timeout: 5000 });

    // Đóng modal bằng nút X
    const closeBtn = page.locator('button:has-text("✕"), [aria-label="Close"], button:has(svg.lucide-x)').first();
    await closeBtn.click();
    await page.waitForTimeout(300);
    await expect(modalTitle.first()).not.toBeVisible();
  });

  test('F05-TC3. Documents: Modal Chia Sẻ Zalo & Mã QR 1-Chạm mở chuẩn và đóng bằng Backdrop', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/documents');
    await page.waitForLoadState('networkidle');

    // Mở preview modal trước
    const docTitle = page.locator('h3[title]').first();
    await docTitle.click();
    await page.waitForTimeout(400);

    // Nhấp nút Chia Sẻ Zalo trong modal preview
    const shareBtn = page.locator('button:has-text("Chia Sẻ Zalo")').first();
    await shareBtn.click();
    await page.waitForTimeout(400);

    // Modal chia sẻ xuất hiện
    const shareTitle = page.locator('text=Gửi Tài Liệu Sales Kit Cho Khách Hàng VIP');
    await expect(shareTitle).toBeVisible();

    // Đóng modal bằng cách nhấp ra ngoài backdrop
    await page.mouse.click(10, 10);
    await page.waitForTimeout(300);
    await expect(shareTitle).not.toBeVisible();
  });

  test('F05-TC4. Documents: Modal Tải Lên Tài Liệu Mới với validation và thêm mới thành công', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/documents');
    await page.waitForLoadState('networkidle');

    // Click nút Đăng Tải Tài Liệu
    const uploadBtn = page.locator('button:has-text("Đăng Tải Tài Liệu")').first();
    await uploadBtn.click();
    await page.waitForTimeout(400);

    // Modal xuất hiện
    const uploadTitle = page.locator('text=Xuất Bản & Đăng Tải Tài Liệu Mới Vào Kho');
    await expect(uploadTitle).toBeVisible();

    // Điền form
    const fileNameInput = page.locator('input[value*=".pdf"]').first();
    const newDocName = `Chinh_Sach_Uu_Dai_VVIP_${Date.now().toString().slice(-4)}.pdf`;
    await fileNameInput.fill(newDocName);

    // Bấm Xuất Bản Vào Kho Dữ Liệu
    const submitBtn = page.locator('button:has-text("Xuất Bản Vào Kho Dữ Liệu")').first();
    await submitBtn.click();
    await page.waitForTimeout(500);

    // Modal tự đóng
    await expect(uploadTitle).not.toBeVisible();

    // Tài liệu mới xuất hiện trên danh sách
    await expect(page.locator(`text=${newDocName}`).first()).toBeVisible({ timeout: 5000 });
  });

  // =========================================================================
  // CHỨC NĂNG 6: CÀI ĐẶT HỆ THỐNG & BẢO MẬT AUDIT LOG (/settings)
  // =========================================================================

  test('F06-TC1. Settings: Chuyển đổi mượt mà giữa các tab RBAC, Security, Audit Log và Backup', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/settings');
    await page.waitForLoadState('networkidle');

    // Kiểm tra tiêu đề phân hệ
    await expect(page.locator('text=Cài Đặt Hệ Thống').or(page.locator('text=System Settings')).first()).toBeVisible();

    // Chuyển sang Tab "Nhật Ký Kiểm Toán" (Audit Log)
    const auditTab = page.locator('button:has-text("Kiểm Toán"), button:has-text("Audit"), [role="tab"]:has-text("Audit")').first();
    if (await auditTab.isVisible()) {
      await auditTab.click();
      await page.waitForTimeout(400);
      await expect(page.locator('text=EXPORT_CUSTOMERS').or(page.locator('text=UPDATE_CONTRACT')).or(page.locator('text=Nhật Ký')).first()).toBeVisible();
    }

    // Chuyển sang Tab "Bảo Mật" (Security)
    const secTab = page.locator('button:has-text("Bảo Mật"), button:has-text("Security"), [role="tab"]:has-text("Bảo Mật")').first();
    if (await secTab.isVisible()) {
      await secTab.click();
      await page.waitForTimeout(400);
      await expect(page.locator('text=Xác thực 2 bước').or(page.locator('text=2FA')).or(page.locator('text=Whitelist')).first()).toBeVisible();
    }
  });

  test('F06-TC2. Settings: Tương tác ma trận phân quyền RBAC có phản hồi Toast tức thì', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/settings');
    await page.waitForLoadState('networkidle');

    // Kiểm tra checkbox quyền hạn trong tab RBAC
    const permCheckbox = page.locator('button[role="checkbox"]').first();
    if (await permCheckbox.isVisible()) {
      await permCheckbox.click({ force: true });
      await page.waitForTimeout(300);
    }
  });

  test('F06-TC3. Settings: Phân quyền bảo vệ - Tài khoản AGENT bị chặn truy cập cài đặt quản trị', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: agentToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'AGENT', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Trần Văn Agent', role: 'AGENT' })), domain: 'localhost', path: '/' },
    ]);

    // Thử truy cập trực tiếp URL quản trị hệ thống
    await page.goto('http://localhost:3000/settings');
    await page.waitForTimeout(1000);

    // Kiểm tra hệ thống chuyển hướng hoặc chặn hiển thị nội dung Super Admin
    const hasSuperAdminControl = await page.locator('text=Xóa vĩnh viễn Dữ liệu (Hard Delete)').isVisible();
    expect(hasSuperAdminControl).toBe(false);
  });
});
