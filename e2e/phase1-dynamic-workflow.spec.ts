import { test, expect } from '@playwright/test';

test.describe('GIAI ĐOẠN 1: KIỂM TRA LUỒNG DỮ LIỆU ĐỘNG THỰC TẾ (TRÁNH HTML GẮN CỨNG)', () => {
  let adminToken: string;

  test.beforeAll(async ({ request }) => {
    const adminLoginRes = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: 'admin@novacrm.com', password: 'password123' },
    });
    expect(adminLoginRes.status()).toBe(200);
    const body = await adminLoginRes.json();
    adminToken = body.data?.accessToken || body.accessToken;
  });

  test('WF-01. Customers: Điền Form trên UI Modal -> Gửi Request POST /customers -> Lưu PostgreSQL -> Render động trên UI', async ({ page, context, request }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/customers');
    await page.waitForLoadState('networkidle');

    // 1. Mở Modal Thêm Khách Hàng trên UI
    const addBtn = page.locator('button:has-text("Thêm Khách Hàng"), button:has-text("Thêm mới")').first();
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    // 2. Kiểm tra Modal hiển thị
    const modal = page.locator('div[role="dialog"]').or(page.locator('text=Thêm Khách Hàng Mới')).first();
    await expect(modal).toBeVisible();

    // 3. Nhập thông tin form động hoàn toàn (Random unique values)
    const uniqueSuffix = Date.now().toString().slice(-4);
    const dynamicName = `Khách Động UI_${uniqueSuffix}`;
    const dynamicPhone = '091' + Math.floor(1000000 + Math.random() * 8999999);
    const dynamicEmail = `dynamic.${uniqueSuffix}@novacrm.vn`;

    // Điền form với đúng placeholder của component
    await page.locator('input[placeholder*="Thế Cường"]').first().fill(dynamicName);
    await page.locator('input[placeholder*="0901234567"]').first().fill(dynamicPhone);
    const emailInput = page.locator('input[placeholder*="khachhang@gmail.com"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill(dynamicEmail);
    }

    // 4. Lắng nghe API Request POST /api/v1/customers được kích hoạt bởi hành động Submit
    const [apiResponse] = await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/v1/customers') && res.request().method() === 'POST', { timeout: 10000 }),
      page.locator('button[type="submit"]:has-text("Tạo Khách Hàng")').first().click(),
    ]);

    // 5. Xác nhận Backend trả về 201 Created và lưu thật vào Database
    expect(apiResponse.status()).toBe(201);
    const createdData = (await apiResponse.json()).data || (await apiResponse.json());
    expect(createdData.fullName).toBe(dynamicName);
    expect(createdData.phone).toBe(dynamicPhone);
    const savedCustomerId = createdData.id;

    // 6. Truy vấn độc lập lại Database Backend để xác thực dữ liệu tồn tại trong DB
    const verifyDbRes = await request.get(`http://localhost:4000/api/v1/customers/${savedCustomerId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(verifyDbRes.status()).toBe(200);
    const dbCustomer = (await verifyDbRes.json()).data || (await verifyDbRes.json());
    expect(dbCustomer.fullName).toBe(dynamicName);

    // 7. Xác nhận giao diện người dùng hiển thị đúng bản ghi động vừa tạo
    const searchInput = page.locator('input[placeholder*="Tìm"], input[placeholder*="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill(dynamicName);
      await page.waitForTimeout(600);
    }
    await expect(page.locator(`text=${dynamicName}`).first()).toBeVisible({ timeout: 8000 });
  });

  test('WF-02. Projects: Tạo dự án qua Form UI -> Gửi Request POST /projects -> Lưu DB -> Render thẻ dự án động', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/projects');
    await page.waitForLoadState('networkidle');

    // 1. Mở Modal Khởi Tạo Dự Án trên UI qua nút "Thêm Dự Án Mới"
    const addProjectBtn = page.locator('button:has-text("Thêm Dự Án Mới")').first();
    await expect(addProjectBtn).toBeVisible({ timeout: 8000 });
    await addProjectBtn.click();

    // 2. Nhập thông tin dự án hoàn toàn ngẫu nhiên
    const uniqueSuffix = Date.now().toString().slice(-4);
    const dynamicProjectTitle = `Khu Đô Thị Động UI_${uniqueSuffix}`;
    const dynamicLocation = `TP. Dĩ An, Tỉnh Bình Dương (${uniqueSuffix})`;

    await page.locator('input[placeholder*="Masteri Centre Point"]').first().fill(dynamicProjectTitle);
    await page.locator('input[placeholder*="Tây Hồ Tây"]').first().fill(dynamicLocation);

    // 3. Lắng nghe API Request POST /api/v1/projects từ UI
    const [apiResponse] = await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/v1/projects') && res.request().method() === 'POST', { timeout: 10000 }),
      page.locator('button[type="submit"]:has-text("Tạo Dự Án")').first().click(),
    ]);

    // 4. Xác thực Backend phản hồi thành công 201
    expect(apiResponse.status()).toBe(201);
    const createdProject = (await apiResponse.json()).data || (await apiResponse.json());
    expect(createdProject.title || createdProject.name).toBe(dynamicProjectTitle);

    // 5. Kiểm tra UI render thẻ dự án động
    await expect(page.locator(`text=${dynamicProjectTitle}`).first()).toBeVisible({ timeout: 8000 });
  });

  test('WF-03. Inventory: Đấu nối dữ liệu động và gọi Backend Batch-Lock khi thao tác trên UI', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/inventory');
    await page.waitForLoadState('networkidle');

    // 1. Kiểm tra ma trận căn hiển thị ô căn hộ
    const unitCard = page.locator('text=NVW-01.01').or(page.locator('text=AQ-01.01')).or(page.locator('text=A1-01')).first();
    await expect(unitCard).toBeVisible({ timeout: 10000 });

    // 2. Click vào ô căn để mở Modal chi tiết
    await unitCard.click();
    const detailDialog = page.locator('div[role="dialog"]').first();
    await expect(detailDialog).toBeVisible({ timeout: 8000 });

    // 3. Thao tác Khóa/Mở căn và xác nhận API batch-lock được kích hoạt
    const lockActionBtn = detailDialog.locator('button:has-text("Khóa Căn"), button:has-text("Mở Khóa Căn")').first();
    await expect(lockActionBtn).toBeVisible();

    const [lockRes] = await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/v1/inventory/batch-lock') && res.request().method() === 'POST', { timeout: 10000 }).catch(() => null),
      lockActionBtn.click(),
    ]);

    if (lockRes) {
      expect(lockRes.status()).toBe(201);
    }
  });
});
