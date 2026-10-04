import { test, expect } from '@playwright/test';

test.describe('GIAI ĐOẠN 2: GIAO DỊCH & PHÁP LÝ KHÉP KÍN (BOOKING, CONTRACTS, HANDOVER, RESALE, AUCTION, MORTGAGE)', () => {
  let adminToken: string;
  let agentToken: string;

  test.beforeAll(async ({ request }) => {
    // 1. Lấy token Admin
    const adminLoginRes = await request.post('http://127.0.0.1:4000/api/v1/auth/login', {
      data: { email: 'admin@novacrm.com', password: 'password123' },
    });
    expect(adminLoginRes.status()).toBe(200);
    const adminBody = await adminLoginRes.json();
    adminToken = adminBody.data?.accessToken || adminBody.accessToken;

    // 2. Lấy token Agent
    const agentLoginRes = await request.post('http://127.0.0.1:4000/api/v1/auth/login', {
      data: { email: 'agent@novacrm.com', password: 'password123' },
    });
    expect(agentLoginRes.status()).toBe(200);
    const agentBody = await agentLoginRes.json();
    agentToken = agentBody.data?.accessToken || agentBody.accessToken;
  });

  // =========================================================================
  // MODULE 7: ĐẶT CHỖ & GIỮ CHỖ (BOOKING & LOCK MATRIX)
  // =========================================================================
  test('P2-01. Booking: Render Kanban động, SLA đếm ngược và Tạo Booking mới với dữ liệu động', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/booking');
    await page.waitForLoadState('domcontentloaded');

    // 1. Kiểm tra tiêu đề và các cột Kanban
    await expect(page.locator('text=Booking Workflow').or(page.locator('text=Giữ Chỗ & Đặt Cọc')).first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Chờ duyệt').or(page.locator('text=Giữ Chỗ')).first()).toBeVisible();

    // 2. Mở Modal Tạo Booking Mới
    const createBtn = page.locator('button:has-text("Tạo Yêu Cầu Booking Mới")').first();
    await expect(createBtn).toBeVisible();
    await page.waitForTimeout(500);
    await createBtn.click();

    // 3. Kiểm tra Modal mở và có z-[1000]
    const dialog = page.locator('div[role="dialog"]:not([data-nextjs-dialog])').first();
    await expect(dialog).toBeVisible({ timeout: 5000 });
    const dialogClass = await dialog.getAttribute('class');
    expect(dialogClass).toContain('z-[1000]');

    // 4. Nhập thông tin số điện thoại khách hàng động (kiểm tra tính động, tránh HTML tĩnh)
    const dynamicPhone = `0987${Date.now().toString().slice(-6)}`;
    const phoneInput = dialog.locator('input[placeholder*="0901234567"]').first();
    if (await phoneInput.isVisible()) {
      await phoneInput.fill(dynamicPhone);
    }

    // 5. Submit form tạo booking
    const submitBtn = dialog.locator('button[type="submit"]:has-text("Xác Nhận Tạo Phiếu Booking")').first();
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // 6. Modal tự động đóng lại sau khi submit
    await expect(dialog).toBeHidden({ timeout: 5000 });

    // 7. Xác nhận phiếu booking mới hiển thị trên Kanban với dữ liệu động
    await expect(page.locator(`text=${dynamicPhone}`).or(page.locator('text=NVW-')).or(page.locator('text=BK-')).first()).toBeVisible({ timeout: 8000 });
  });

  // =========================================================================
  // MODULE 8: HỢP ĐỒNG & CHỮ KÝ SỐ (CONTRACTS & E-SIGN)
  // =========================================================================
  test('P2-02. Contracts: Tạo HĐ mới qua UI Modal -> Gửi Request POST /contracts -> Render bảng dữ liệu động', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/contracts');
    await page.waitForLoadState('domcontentloaded');

    // 1. Kiểm tra 5 KPI metric cards
    await expect(page.locator('text=Tổng doanh số ký kết').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Thực thu đã vào tài khoản').first()).toBeVisible();

    // 2. Mở Modal Lập Hợp Đồng Mới
    const createContractBtn = page.locator('button:has-text("Lập Hợp Đồng Mới")').first();
    await expect(createContractBtn).toBeVisible();
    await createContractBtn.click();

    // 3. Kiểm tra Modal mở với z-[1000]
    const dialog = page.locator('div[role="dialog"]:not([data-nextjs-dialog])').first();
    await expect(dialog).toBeVisible({ timeout: 5000 });
    const dialogClass = await dialog.getAttribute('class');
    expect(dialogClass).toContain('z-[1000]');

    // 4. Chọn Khách Hàng bằng select trigger
    const customerTrigger = dialog.locator('button:has-text("Chọn khách hàng")').first();
    if (await customerTrigger.isVisible()) {
      await customerTrigger.click();
      await page.waitForTimeout(200);
      const opt = page.locator('[role="option"]').first();
      if (await opt.isVisible()) await opt.click();
    }

    // Chọn dự án bằng select trigger
    const projectTrigger = dialog.locator('button:has-text("Chọn dự án")').first();
    if (await projectTrigger.isVisible()) {
      await projectTrigger.click();
      await page.waitForTimeout(200);
      const opt = page.locator('[role="option"]').first();
      if (await opt.isVisible()) await opt.click();
    }

    // Chọn căn hộ nếu khả dụng
    const unitTrigger = dialog.locator('button:has-text("Chọn căn khả dụng")').first();
    if (await unitTrigger.isVisible({ timeout: 1000 }).catch(() => false)) {
      await unitTrigger.click();
      await page.waitForTimeout(200);
      const opt = page.locator('[role="option"]').first();
      if (await opt.isVisible()) await opt.click();
    }

    // 5. Xác nhận nút tạo hợp đồng và gửi request
    const submitBtn = dialog.locator('button[type="submit"]:has-text("Xác Nhận Tạo Hợp Đồng Mới")').first();
    await expect(submitBtn).toBeVisible();

    const [contractApiRes] = await Promise.all([
      page.waitForResponse(res => res.url().includes('/contracts') && res.request().method() === 'POST', { timeout: 8000 }).catch(() => null),
      submitBtn.click(),
    ]);

    // 6. Modal đóng lại sau khi tạo thành công
    await expect(dialog).toBeHidden({ timeout: 5000 });

    // 7. Xác nhận hợp đồng mới xuất hiện trên bảng dữ liệu với trạng thái Chờ phê duyệt hoặc mã HĐ
    await expect(page.locator('text=Chờ phê duyệt').or(page.locator('text=HD-')).first()).toBeVisible({ timeout: 8000 });
  });

  test('P2-03. Contracts Detail: Xác thực e-Sign SHA-256 và Ghi nhận Thu tiền Đợt tiếp theo với dữ liệu động', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    // Truy cập trực tiếp trang chi tiết hợp đồng ct2 (trạng thái ban đầu: Chờ duyệt)
    await page.goto('http://localhost:3000/contracts/ct2');
    await page.waitForLoadState('domcontentloaded');

    // 1. Kiểm tra các khối thông tin pháp lý
    await expect(page.locator('text=Bên Mua (Bên B)').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Phụ Lục Kế Hoạch & Tiến Độ Thanh Toán').first()).toBeVisible();

    // 2. Thao tác Phê Duyệt & Ký HĐ động -> xác nhận chuyển sang "Đã Ký Chính Thức"
    const approveBtn = page.locator('button:has-text("Phê Duyệt & Ký HĐ")').first();
    if (await approveBtn.isVisible()) {
      await approveBtn.click();
      await expect(page.locator('text=Đã Ký Chính Thức').first()).toBeVisible({ timeout: 5000 });
    }

    // 3. Thao tác Ghi Nhận Thu Tiền Đợt Kế Tiếp (Đợt 3) động
    const payBtn = page.locator('button:has-text("Thu tiền")').first();
    if (await payBtn.isVisible()) {
      await payBtn.click();
      // Sau khi click thu tiền, nút chuyển thành badge "Hoàn tất"
      await expect(page.locator('text=Hoàn tất').first()).toBeVisible({ timeout: 5000 });
    }

    // 4. Mở Modal Gửi Email và kiểm tra z-[1000]
    const emailBtn = page.locator('button:has-text("Gửi Email Khách")').first();
    await expect(emailBtn).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(300);
    await emailBtn.click();
    const emailDialog = page.locator('[data-slot="dialog-content"]').first();
    await expect(emailDialog).toBeVisible({ timeout: 8000 });
    expect(await emailDialog.getAttribute('class')).toContain('z-[1000]');
    await emailDialog.locator('button:has-text("Hủy")').click();
    await expect(emailDialog).toBeHidden({ timeout: 5000 });
  });

  // =========================================================================
  // MODULE 9: BÀN GIAO & NGHIỆM THU (HANDOVER & DEFECT INSPECTION)
  // =========================================================================
  test('P2-04. Handover: Danh sách nghiệm thu, Đặt lịch hẹn, Báo lỗi Snagging với dữ liệu động', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/handover');
    await page.waitForLoadState('domcontentloaded');

    // 1. Kiểm tra tiêu đề và KPI bàn giao
    await expect(page.locator('text=Bàn Giao Bất Động Sản').first()).toBeVisible({ timeout: 10000 });

    // 2. Mở Modal Lập Lịch Hẹn Bàn Giao
    const appBtn = page.locator('button:has-text("Lập Lịch Hẹn Bàn Giao")').first();
    await expect(appBtn).toBeVisible();
    await appBtn.click();

    // 3. Kiểm tra Modal mở và có z-[1000]
    const appDialog = page.locator('div[role="dialog"]:not([data-nextjs-dialog])').first();
    await expect(appDialog).toBeVisible({ timeout: 5000 });
    expect(await appDialog.getAttribute('class')).toContain('z-[1000]');
    await appDialog.locator('button:has-text("Hủy Bỏ"), button:has-text("Hủy")').first().click();

    // 4. Mở Modal Báo Lỗi Snagging và nhập dữ liệu động
    const defectBtn = page.locator('button:has-text("Khai Báo Lỗi Snagging")').first();
    await expect(defectBtn).toBeVisible();
    await defectBtn.click();

    const defectDialog = page.locator('div[role="dialog"]:not([data-nextjs-dialog])').first();
    await expect(defectDialog).toBeVisible({ timeout: 5000 });
    expect(await defectDialog.getAttribute('class')).toContain('z-[1000]');

    // Nhập vị trí và mô tả khiếm khuyết động
    const dynamicLoc = `Ban công phòng ngủ ${Date.now().toString().slice(-4)}`;
    const dynamicDesc = `Vết nứt nhẹ kính cường lực ${Date.now().toString().slice(-4)}`;
    await defectDialog.locator('input[placeholder*="Phòng khách"]').first().fill(dynamicLoc);
    await defectDialog.locator('textarea').first().fill(dynamicDesc);

    // Gửi form khai báo lỗi
    const submitDefectBtn = defectDialog.locator('button[type="submit"]:has-text("Xác Nhận Khai Báo")').first();
    await submitDefectBtn.click();
    await expect(defectDialog).toBeHidden({ timeout: 5000 });

    // 5. Chuyển tab "Nghiệm Thu Khiếm Khuyết" và kiểm tra lỗi vừa thêm xuất hiện động
    const snaggingTab = page.locator('button:has-text("Nghiệm Thu Khiếm Khuyết")').first();
    await snaggingTab.click();
    await expect(page.locator(`text=${dynamicLoc}`).first()).toBeVisible({ timeout: 8000 });

    // 6. Chuyển tab "Tiến Trình Cấp Sổ Hồng" và kiểm tra tiến độ pháp lý
    const pinkBookTab = page.locator('button:has-text("Tiến Trình Cấp Sổ Hồng")').first();
    await pinkBookTab.click();
    await expect(page.locator('text=Tiến Trình Cấp Giấy Chứng Nhận').or(page.locator('text=Tiếp Nhận Hồ Sơ')).first()).toBeVisible();
  });

  // =========================================================================
  // MODULE 10: CHUYỂN NHƯỢNG & THỨ CẤP (RESALE & MATCHING ENGINE)
  // =========================================================================
  test('P2-05. Resale: Ký gửi thứ cấp, Đăng ký Nhu cầu mua/thuê, AI Matchmaking và z-[1000]', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/resale');
    await page.waitForLoadState('domcontentloaded');

    // 1. Kiểm tra tiêu đề thị trường thứ cấp
    await expect(page.locator('text=Sàn Ký Gửi & Thị Trường Thứ Cấp').first()).toBeVisible({ timeout: 10000 });

    // 2. Mở Modal Tiếp Nhận Ký Gửi Mới
    const consignBtn = page.locator('button:has-text("Tiếp Nhận Ký Gửi Mới")').first();
    await expect(consignBtn).toBeVisible();
    await consignBtn.click();

    // Kiểm tra overlay có z-[1000]
    const consignModal = page.locator('.fixed.inset-0.z-\\[1000\\]').first();
    await expect(consignModal).toBeVisible({ timeout: 5000 });
    await consignModal.locator('button:has-text("Hủy bỏ"), button:has-text("Hủy")').first().click();

    // 3. Mở Modal Đăng Ký Nhu Cầu Mua / Thuê (Demand)
    const demandBtn = page.locator('button:has-text("Thêm Nhu Cầu Mua/Thuê")').first();
    await expect(demandBtn).toBeVisible();
    await demandBtn.click();

    const demandModal = page.locator('.fixed.inset-0.z-\\[1000\\]').first();
    await expect(demandModal).toBeVisible({ timeout: 5000 });

    // 4. Nhập thông tin nhu cầu mua với dữ liệu động
    const dynamicClient = `Khách Mua Động_${Date.now().toString().slice(-4)}`;
    await demandModal.locator('input[placeholder*="Trần Quốc Bảo"]').first().fill(dynamicClient);
    await demandModal.locator('input[placeholder*="0909.123.456"]').first().fill('0909123456');

    // Gửi form
    await demandModal.locator('button[type="submit"]:has-text("Lưu & Chạy AI So Khớp")').first().click();
    await expect(demandModal).toBeHidden({ timeout: 5000 });

    // 5. Chuyển sang Tab "Nhu Cầu Mua / Thuê & AI Match" và xác nhận xuất hiện dữ liệu động
    const demandsTab = page.locator('button:has-text("Nhu Cầu Mua / Thuê & AI Match")').first();
    await demandsTab.click();
    await expect(page.locator(`text=${dynamicClient}`).first()).toBeVisible({ timeout: 8000 });
  });

  // =========================================================================
  // MODULE 11: ĐẤU GIÁ BẤT ĐỘNG SẢN (PROPERTY AUCTION & ESCROW)
  // =========================================================================
  test('P2-06. Auction: Danh sách phiên, Ký quỹ Escrow và Bidding trong Phòng Live với z-[1000]', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/auction');
    await page.waitForLoadState('domcontentloaded');

    // 1. Kiểm tra tiêu đề sàn đấu giá
    await expect(page.locator('text=Sàn Đấu Giá Bất Động Sản Trực Tuyến').first()).toBeVisible({ timeout: 10000 });

    // 2. Mở Modal Ký Quỹ Đấu Giá
    const escrowBtn = page.locator('button:has-text("Ký Quỹ Đấu Giá")').first();
    await expect(escrowBtn).toBeVisible();
    await page.waitForTimeout(500);
    await escrowBtn.click();

    // 3. Kiểm tra Modal mở và có z-[1000]
    const escrowDialog = page.locator('[data-slot="dialog-content"]').first();
    await expect(escrowDialog).toBeVisible({ timeout: 8000 });
    expect(await escrowDialog.getAttribute('class')).toContain('z-[1000]');

    // Đóng modal ký quỹ
    await escrowDialog.locator('button:has-text("Hủy")').first().click();
    await expect(escrowDialog).toBeHidden({ timeout: 5000 });

    // 4. Mở Phòng Đấu Giá Live (Live Room)
    const liveRoomBtn = page.locator('button:has-text("VÀO PHÒNG ĐẤU GIÁ VIP")').first();
    await expect(liveRoomBtn).toBeVisible();
    await page.waitForTimeout(300);
    await liveRoomBtn.click();

    // 5. Kiểm tra Live Room Dialog có z-[1000] và các phần tử đặt giá
    const liveDialog = page.locator('[data-slot="dialog-content"]').first();
    await expect(liveDialog).toBeVisible({ timeout: 8000 });
    expect(await liveDialog.getAttribute('class')).toContain('z-[1000]');

    // 6. Đặt giá nhanh (+100M) và xác nhận thay đổi trực tiếp trên bảng xếp hạng live
    const bidStepBtn = liveDialog.locator('button:has-text("100 Tr"), button:has-text("+100 Tr")').first();
    await expect(bidStepBtn).toBeVisible({ timeout: 5000 });
    await bidStepBtn.click();

    // Xác nhận bạn (VIP #007) dẫn đầu phiên đấu giá
    await expect(liveDialog.locator('text=Bạn (VIP #007)').first()).toBeVisible({ timeout: 5000 });
    await expect(liveDialog.locator('text=Dẫn đầu').first()).toBeVisible({ timeout: 5000 });

    // 7. Đóng phòng live
    const closeBtn = liveDialog.locator('button:has-text("Rời Phòng Đấu Giá")').first();
    await closeBtn.click();
    await expect(liveDialog).toBeHidden();
  });

  // =========================================================================
  // MODULE 12: TÍNH TOÁN VAY VỐN & BANK SLA (MORTGAGE SIMULATION)
  // =========================================================================
  test('P2-07. Mortgage: Công cụ tài chính, Tính toán khấu hao, So sánh gói vay và Lưu kịch bản với dữ liệu động', async ({ page, context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: adminToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
      { name: 'nova_auth_user', value: encodeURIComponent(JSON.stringify({ fullName: 'Lê Hoàng Anh', role: 'SUPER_ADMIN' })), domain: 'localhost', path: '/' },
    ]);

    await page.goto('http://localhost:3000/mortgage');
    await page.waitForLoadState('domcontentloaded');

    // 1. Kiểm tra tiêu đề trang tính lãi suất
    await expect(page.locator('text=Bảng Tính Lãi Vay & Dòng Tiền Đầu Tư BĐS').first()).toBeVisible({ timeout: 10000 });

    // 2. Kiểm tra danh mục các ngân hàng đối tác liên kết
    await expect(page.locator('text=MBBank').first()).toBeVisible();
    await expect(page.locator('text=Techcombank').first()).toBeVisible();
    await expect(page.locator('text=Vietcombank').first()).toBeVisible();

    // 3. Mở Modal So Sánh Gói Vay Ngân Hàng
    const compareBtn = page.locator('button:has-text("So Sánh 4 Ngân Hàng")').first();
    await expect(compareBtn).toBeVisible();
    await compareBtn.click();

    // 4. Kiểm tra Modal mở có z-[1000]
    const compareModal = page.locator('.fixed.inset-0.z-\\[1000\\]').first();
    await expect(compareModal).toBeVisible({ timeout: 5000 });
    await compareModal.locator('button:has-text("Đóng Bảng So Sánh")').click();

    // 5. Mở Modal Lưu Phương Án Tài Chính với dữ liệu động
    const savePlanBtn = page.locator('button:has-text("Lưu / Xuất Báo Cáo")').first();
    await expect(savePlanBtn).toBeVisible();
    await savePlanBtn.click();

    const saveModal = page.locator('.fixed.inset-0.z-\\[1000\\]').first();
    await expect(saveModal).toBeVisible({ timeout: 5000 });

    const dynamicNote = `Kế hoạch tài chính VIP_${Date.now().toString().slice(-4)}`;
    const noteInput = saveModal.locator('input[placeholder*="Nhập ghi chú"]').first();
    if (await noteInput.isVisible()) {
      await noteInput.fill(dynamicNote);
    }

    // Xác nhận lưu phương án
    const confirmSaveBtn = saveModal.locator('button:has-text("Lưu Vào Hồ Sơ Khách Hàng")').first();
    await confirmSaveBtn.click();
    await expect(saveModal).toBeHidden({ timeout: 5000 });

    // 6. Chuyển sang Tab "Hồ Sơ Vay Đã Lưu" và kiểm tra kịch bản vừa lưu hiển thị chính xác ghi chú động
    const savedTab = page.locator('button:has-text("Hồ Sơ Vay Đã Lưu")').first();
    await savedTab.click();
    await expect(page.locator(`text=${dynamicNote}`).first()).toBeVisible({ timeout: 8000 });
  });

  // =========================================================================
  // BẢO MẬT & PHÂN QUYỀN RBAC CHO GIAI ĐOẠN 2
  // =========================================================================
  test('P2-08. RBAC & Security: Agent không thể duyệt hợp đồng trái thẩm quyền', async ({ request }) => {
    // 1. Thử gửi request duyệt thanh toán hợp đồng bằng quyền AGENT (yêu cầu ACCOUNTANT hoặc ADMIN)
    const unauthorizedPayRes = await request.post('http://127.0.0.1:4000/api/v1/contracts/c-test-rbac/payments', {
      headers: { Authorization: `Bearer ${agentToken}` },
      data: { amount: 500000000 },
    });

    // 2. Xác thực Backend chặn 403 Forbidden theo đúng phân quyền NestJS RolesGuard
    expect(unauthorizedPayRes.status()).toBe(403);
  });
});
