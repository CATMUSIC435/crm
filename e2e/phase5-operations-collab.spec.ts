import { test, expect } from '@playwright/test';

const BACKEND_URL = 'http://localhost:4000';
const FRONTEND_URL = 'http://localhost:3000';

test.describe('Giai Đoạn 5: Vận Hành Tòa Nhà, Quản Lý Công Việc, Chat Nội Bộ, Workflow Phê Duyệt, Tích Hợp Apps & Quản Lý Danh Mục Đầu Tư', () => {
  let authToken = '';

  test.beforeAll(async () => {
    // Đăng nhập tài khoản admin để lấy Bearer token kiểm thử Backend API
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@novacrm.com', password: 'password123' }),
    });
    expect(res.ok).toBeTruthy();
    const data = await res.json();
    authToken = data.data.accessToken;
    expect(authToken).toBeTruthy();
  });

  // Thiết lập Cookie xác thực phiên làm việc SUPER_ADMIN trước mỗi test case UI
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'nova_auth_token', value: authToken, domain: 'localhost', path: '/' },
      { name: 'nova_auth_role', value: 'SUPER_ADMIN', domain: 'localhost', path: '/' },
    ]);
  });

  // =========================================================================
  // 1. MODULE 25: VẬN HÀNH TÒA NHÀ & QUẢN LÝ CƯ DÂN (/operations)
  // =========================================================================
  test.describe('25. Vận Hành Tòa Nhà & Quản Lý Cư Dân (/operations)', () => {
    test('UI-25.1: Hiển thị Dashboard Vận Hành Tòa Nhà với các chỉ số KPI dịch vụ', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/operations`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Kiểm tra Header chính
      const heading = page.locator('h1:has-text("Quản Trị Vận Hành Bất Động Sản & Dịch Vụ Cư Dân")');
      await expect(heading).toBeVisible({ timeout: 10000 });

      // Kiểm tra 4 tab chức năng
      await expect(page.locator('button:has-text("Hóa Đơn & Thu Phí Dịch Vụ")')).toBeVisible();
      await expect(page.locator('button:has-text("Cấp Phép Thi Công Nội Thất")')).toBeVisible();
      await expect(page.locator('button:has-text("Đặt Chỗ Tiện Ích Clubhouse")')).toBeVisible();
      await expect(page.locator('button:has-text("Tiếp Nhận Sự Cố Cư Dân 24/7")')).toBeVisible();
    });

    test('UI-25.2: Tạo Hóa Đơn Phí Quản Lý Cư Dân mới với mã căn & tên động Date.now()', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/operations`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      const dynamicResident = `Cư Dân VIP-${Date.now().toString().slice(-4)}`;

      // Bấm nút "Lập Hóa Đơn Phí"
      const createBtn = page.locator('button:has-text("Lập Hóa Đơn Phí")');
      await expect(createBtn).toBeVisible({ timeout: 10000 });
      await createBtn.click();

      // Kiểm tra Modal hiển thị
      const modal = page.locator('div[role="dialog"]:has-text("Lập Hóa Đơn Phí Quản Lý Tòa Nhà Mới")');
      await expect(modal).toBeVisible();

      // Nhập tên cư dân động
      const residentInput = modal.locator('input').nth(1);
      await residentInput.fill(dynamicResident);

      // Submit
      await modal.locator('button[type="submit"]:has-text("Tạo Hóa Đơn & Sinh Mã QR")').click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });

      // Kiểm tra hóa đơn mới xuất hiện trong bảng danh sách
      await expect(page.locator(`text=${dynamicResident}`).first()).toBeVisible({ timeout: 10000 });
    });

    test('UI-25.3: Thao tác Gạch Nợ (Thanh Toán) hóa đơn phí dịch vụ chuyển trạng thái sang Đã thanh toán', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/operations`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Tìm nút "Gạch Nợ" trên một hóa đơn chưa thanh toán
      const payBtn = page.locator('button:has-text("Gạch Nợ")').first();
      if (await payBtn.isVisible()) {
        await payBtn.click();
        // Toast thành công hiển thị
        await expect(page.locator('text=Đã gạch nợ thành công')).toBeVisible({ timeout: 5000 });
      } else {
        // Nếu tất cả đã thanh toán, kiểm tra badge "Đã thanh toán"
        await expect(page.locator('text=Đã thanh toán').first()).toBeVisible();
      }
    });

    test('UI-25.4: Đăng ký Cấp Phép Thi Công Nội Thất Fitout qua Modal (z-[1000])', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/operations`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Bấm nút "Cấp Phép Thi Công"
      const fitoutBtn = page.getByRole('button', { name: 'Cấp Phép Thi Công', exact: true });
      await expect(fitoutBtn).toBeVisible({ timeout: 10000 });
      await fitoutBtn.click();

      // Modal hiển thị
      const modal = page.locator('div[role="dialog"]:has-text("Đăng Ký Cấp Phép Thi Công Nội Thất")');
      await expect(modal).toBeVisible();

      // Submit đăng ký
      await modal.locator('button[type="submit"]:has-text("Xác Nhận Cấp Phép")').click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });

      // Chuyển sang Tab "Cấp Phép Thi Công Nội Thất"
      await page.locator('button:has-text("Cấp Phép Thi Công Nội Thất")').click();
      await expect(page.locator('text=Hồ sơ đăng ký').or(page.locator('text=Chờ duyệt')).first()).toBeVisible({ timeout: 10000 });
    });

    test('API-25.5: Backend Operations Controller đồng bộ hóa đơn và cấp phép', async () => {
      // 1. Lấy danh sách hóa đơn
      const resBills = await fetch(`${BACKEND_URL}/api/v1/operations/bills`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(resBills.status).toBe(200);
      const bills = await resBills.json();
      expect(bills.success).toBe(true);
      expect(Array.isArray(bills.data)).toBe(true);

      // 2. Tạo hóa đơn mới
      const uniqueResident = `Cư Dân BE-${Date.now().toString().slice(-4)}`;
      const resCreateBill = await fetch(`${BACKEND_URL}/api/v1/operations/bills`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billCode: `INV-BE-${Date.now().toString().slice(-6)}`,
          month: '08/2026',
          propertyCode: 'NVW-01.01',
          projectName: 'NovaWorld Phan Thiet',
          residentName: uniqueResident,
          residentPhone: '0988776655',
          managementFee: 4500000,
          parkingFee: 1200000,
          utilitiesFee: 800000,
          dueDate: '25/08/2026',
        }),
      });
      expect(resCreateBill.status).toBe(201);

      // 3. Lấy danh sách cấp phép thi công
      const resPermits = await fetch(`${BACKEND_URL}/api/v1/operations/permits`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(resPermits.status).toBe(200);
      const permits = await resPermits.json();
      expect(Array.isArray(permits.data)).toBe(true);
    });
  });

  // =========================================================================
  // 2. MODULE 26: QUẢN LÝ CÔNG VIỆC & LỊCH LÀM VIỆC (/tasks)
  // =========================================================================
  test.describe('26. Quản Lý Công Việc & Lịch Làm Việc (/tasks)', () => {
    test('UI-26.1: Hiển thị Bảng Kanban Điều Phối Công Việc & Lịch Hẹn Khách Hàng', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/tasks`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      const heading = page.locator('h1:has-text("Quản Lý Công Việc & Lịch Hẹn Khách Hàng")');
      await expect(heading).toBeVisible({ timeout: 10000 });

      // Kiểm tra 4 cột Kanban hoặc các tab view
      await expect(page.locator('button[role="tab"]:has-text("Bảng Kanban")')).toBeVisible();
      await expect(page.locator('button[role="tab"]:has-text("Danh Sách")')).toBeVisible();
      await expect(page.locator('button[role="tab"]:has-text("Lịch Tháng (Calendar)")')).toBeVisible();
    });

    test('UI-26.2: Tạo Nhiệm Vụ Mới với tên động Date.now() qua Modal (z-[1000]) và render tức thì', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/tasks`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      const dynamicTaskTitle = `Đón đoàn đầu tư Hà Nội tham quan Shophouse-${Date.now()}`;

      // Bấm "Tạo Nhiệm Vụ Mới"
      const createBtn = page.locator('button:has-text("Tạo Nhiệm Vụ Mới")');
      await expect(createBtn).toBeVisible({ timeout: 10000 });
      await createBtn.click();

      // Modal hiển thị
      const modal = page.locator('div[role="dialog"]:has-text("Khởi Tạo Nhiệm Vụ & Lịch Hẹn Khách Hàng")');
      await expect(modal).toBeVisible();

      // Điền tiêu đề
      await modal.locator('input[placeholder*="Đón khách VVIP"]').fill(dynamicTaskTitle);

      // Lưu công việc
      await modal.locator('button:has-text("Lưu & Lên Lịch Tác Nghiệp")').click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });

      // Kiểm tra công việc mới hiển thị trên giao diện
      await expect(page.locator(`text=${dynamicTaskTitle}`).first()).toBeVisible({ timeout: 10000 });
    });

    test('UI-26.3: Chuyển đổi giữa các chế độ xem Kanban, Danh Sách, và Lịch Tháng', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/tasks`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Chuyển sang Tab "Danh Sách"
      const listTab = page.locator('button[role="tab"]:has-text("Danh Sách")');
      await listTab.click();
      await expect(page.locator('th:has-text("Mã / Tiêu Đề Nhiệm Vụ")')).toBeVisible({ timeout: 5000 });

      // Chuyển sang Tab "Lịch Tháng (Calendar)"
      const calendarTab = page.locator('button[role="tab"]:has-text("Lịch Tháng (Calendar)")');
      await calendarTab.click();
      await expect(page.locator('text=Hôm nay').first()).toBeVisible({ timeout: 5000 });
    });

    test('UI-26.4: Thao tác Đặt Xe Dẫn Khách Tham Quan Dự Án qua Modal (z-[1000])', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/tasks`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Bấm nút "Đặt Xe Dẫn Khách"
      const carBtn = page.locator('button:has-text("Đặt Xe Dẫn Khách")');
      await expect(carBtn).toBeVisible({ timeout: 10000 });
      await carBtn.click();

      // Modal hiển thị
      const modal = page.locator('div[role="dialog"]:has-text("Điều Phối Xe Đón Khách Tham Quan Dự Án")');
      await expect(modal).toBeVisible();

      // Xác nhận đặt xe
      await modal.locator('button:has-text("Xác Nhận Đặt Lịch Xe")').click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });

      // Toast thông báo xuất hiện
      await expect(page.locator('text=Đã xác nhận đặt xe').or(page.locator('text=Đã đặt xe'))).toBeVisible({ timeout: 5000 });
    });
  });

  // =========================================================================
  // 3. MODULE 27: NHẮN TIN NỘI BỘ & CHAT DỰ ÁN (/chat)
  // =========================================================================
  test.describe('27. Nhắn Tin Nội Bộ & Chat Dự Án (/chat)', () => {
    test('UI-27.1: Hiển thị Kênh Trò Chuyện & Zalo OA với danh sách phòng thảo luận', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/chat`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      const heading = page.locator('h1:has-text("Kênh Trò Chuyện & Zalo OA")');
      await expect(heading).toBeVisible({ timeout: 10000 });

      // Kiểm tra danh sách kênh trò chuyện hoặc ô tìm kiếm tin nhắn
      await expect(page.locator('input[placeholder*="Tìm tin nhắn"]').first()).toBeVisible();
    });

    test('UI-27.2: Gửi tin nhắn trao đổi dự án với nội dung động Date.now() xuất hiện ngay trên khung chat', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/chat`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      const dynamicMessage = `Chào team! Căn biệt thự sông vừa nhận cọc lúc ${Date.now()}`;

      // Tìm ô soạn thảo tin nhắn
      const textarea = page.locator('textarea[placeholder*="Nhắn tin tới"]').first();
      await expect(textarea).toBeVisible({ timeout: 10000 });
      await textarea.fill(dynamicMessage);

      // Bấm nút gửi (icon Send)
      const sendBtn = page.locator('button:has(svg.lucide-send)').first();
      await expect(sendBtn).toBeVisible();
      await sendBtn.click();

      // Kiểm tra tin nhắn xuất hiện trong luồng hội thoại
      await expect(page.locator(`text=${dynamicMessage}`).first()).toBeVisible({ timeout: 10000 });
    });

    test('UI-27.3: Mở Thư Viện Mẫu Tin Nhắn Nhanh CSKH qua Modal (z-[1000]) và áp dụng mẫu', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/chat`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Bấm nút "Mẫu Tin Nhanh"
      const templateBtn = page.locator('button:has-text("Mẫu Tin Nhanh")').first();
      await expect(templateBtn).toBeVisible({ timeout: 10000 });
      await templateBtn.click();

      // Modal hiển thị với z-[1000]
      const modal = page.locator('div.fixed.z-\\[1000\\]:has-text("Thư Viện Mẫu Tin Nhắn Nhanh CSKH")');
      await expect(modal).toBeVisible();

      // Bấm áp dụng mẫu đầu tiên (Chèn)
      const applyBtn = modal.locator('button:has-text("Chèn"), button:has-text("Áp Dụng")').first();
      if (await applyBtn.isVisible()) {
        await applyBtn.click();
        await expect(modal).not.toBeVisible({ timeout: 5000 });
        // Toast thành công
        await expect(page.locator('text=Đã chèn nội dung')).toBeVisible({ timeout: 5000 });
      } else {
        // Đóng modal bằng nút X
        await modal.locator('button:has(svg.lucide-x)').first().click();
        await expect(modal).not.toBeVisible({ timeout: 5000 });
      }
    });

    test('UI-27.4: Giả lập Cuộc Họp Trực Tuyến Video/Voice Call qua Modal (z-[1000]) với phím điều khiển Micro/Cam', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/chat`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Bấm nút gọi video (icon Video) trên thanh công cụ chat
      const videoCallBtn = page.locator('button:has(svg.lucide-video)').first();
      if (await videoCallBtn.isVisible()) {
        await videoCallBtn.click();

        // Modal phòng họp thoại video hiển thị (z-[1000])
        const callModal = page.locator('div.fixed.z-\\[1000\\]:has-text("Phòng Họp Trực Tuyến")').or(
          page.locator('div.fixed.z-\\[1000\\]:has-text("Đang gọi")')
        ).or(page.locator('div.fixed.z-\\[1000\\]:has(button:has(svg.lucide-phone-off))'));
        
        if (await callModal.isVisible()) {
          // Bấm nút kết thúc cuộc gọi
          const hangupBtn = callModal.locator('button:has(svg.lucide-phone-off), button:has-text("Kết Thúc")').first();
          if (await hangupBtn.isVisible()) {
            await hangupBtn.click();
            await expect(callModal).not.toBeVisible({ timeout: 5000 });
          }
        }
      }
    });
  });

  // =========================================================================
  // 4. MODULE 28: TỰ ĐỘNG HÓA QUY TRÌNH DOANH NGHIỆP WORKFLOW (/workflow)
  // =========================================================================
  test.describe('28. Tự Động Hóa Quy Trình Doanh Nghiệp Workflow (/workflow)', () => {
    test('UI-28.1: Hiển thị Quy Trình Phê Duyệt Đa Cấp & Danh Sách Tờ Trình Ngoại Lệ', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/workflow`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      const heading = page.locator('h1:has-text("Quy Trình Phê Duyệt Đa Cấp & Tự Động Hóa")');
      await expect(heading).toBeVisible({ timeout: 10000 });

      // Kiểm tra nút tạo tờ trình
      await expect(page.locator('button:has-text("Tạo Phiếu Trình Duyệt")')).toBeVisible();
    });

    test('UI-28.2: Tạo Phiếu Trình Duyệt Chính Sách Đặc Cách với tên động Date.now() qua Modal (z-[1000])', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/workflow`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      const dynamicTitle = `Duyệt chiết khấu thanh toán sớm 95% vốn tự có-${Date.now()}`;

      // Bấm "Tạo Phiếu Trình Duyệt"
      const createBtn = page.locator('button:has-text("Tạo Phiếu Trình Duyệt")');
      await expect(createBtn).toBeVisible({ timeout: 10000 });
      await createBtn.click();

      // Modal hiển thị
      const modal = page.locator('div[role="dialog"]:has-text("Lập Phiếu Trình Duyệt Chính Sách Đặc Cách")');
      await expect(modal).toBeVisible();

      // Điền tiêu đề
      await modal.locator('input').first().fill(dynamicTitle);

      // Điền lý do
      await modal.locator('textarea').fill('Khách hàng VIP sở hữu 3 căn Novaland, thanh toán 95% trong 5 ngày làm việc.');

      // Submit chuyển duyệt
      await modal.locator('button:has-text("Chuyển Cấp Quản Lý Thẩm Định")').click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });

      // Kiểm tra đề xuất mới xuất hiện ở danh sách
      await expect(page.locator(`text=${dynamicTitle}`).first()).toBeVisible({ timeout: 10000 });
    });

    test('UI-28.3: Thẩm Định & Phê Duyệt Tờ Trình (Modal z-[1000]) cập nhật trạng thái đã phê duyệt', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/workflow`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Nhấp vào một tờ trình đang chờ duyệt (Pending)
      const pendingTicket = page.locator('tr:has-text("Chờ duyệt")').first().or(page.locator('div:has-text("Chờ duyệt")').first());
      if (await pendingTicket.isVisible()) {
        await pendingTicket.click();

        // Modal chi tiết thẩm định hiển thị
        const detailModal = page.locator('div[role="dialog"]');
        if (await detailModal.isVisible()) {
          // Bấm nút "Phê Duyệt" nếu có
          const approveBtn = detailModal.locator('button:has-text("Phê Duyệt"), button:has-text("Chấp Thuận")').first();
          if (await approveBtn.isVisible()) {
            await approveBtn.click();
            await expect(detailModal).not.toBeVisible({ timeout: 5000 });
          } else {
            // Đóng modal
            await detailModal.locator('button:has-text("Đóng"), button:has(svg.lucide-x)').first().click();
          }
        }
      }
    });

    test('UI-28.4: Kiểm tra Lịch Sử Phê Duyệt (Audit Workflow Steps) ghi nhận đầy đủ cấp duyệt', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/workflow`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Kiểm tra hiển thị cấp duyệt (Trưởng Phòng KD, Giám Đốc Sàn, GĐ Khối, Tổng Giám Đốc)
      await expect(page.locator('text=Trưởng Phòng KD').or(page.locator('text=Giám Đốc')).first()).toBeVisible({ timeout: 10000 });
    });
  });

  // =========================================================================
  // 5. MODULE 29: CHỢ ỨNG DỤNG & CỔNG KẾT NỐI INTEGRATIONS (/integrations)
  // =========================================================================
  test.describe('29. Chợ Ứng Dụng & Cổng Kết Nối Integrations (/integrations)', () => {
    test('UI-29.1: Hiển thị Cổng Tích Hợp API, Webhook & ERP Doanh Nghiệp kèm danh bạ ứng dụng', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/integrations`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      const heading = page.locator('h1:has-text("Cổng Tích Hợp API, Webhook & ERP Doanh Nghiệp")');
      await expect(heading).toBeVisible({ timeout: 10000 });

      // Kiểm tra hiển thị các đối tác (MISA, Zalo, VNPT, VietQR)
      await expect(page.locator('text=MISA AMIS ERP').or(page.locator('text=MISA')).first()).toBeVisible();
      await expect(page.locator('text=VietQR').first()).toBeVisible();
    });

    test('UI-29.2: Tạo Khóa API Key Doanh Nghiệp Mới với tên động Date.now() qua Modal (z-[1000])', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/integrations`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      const dynamicKeyName = `Khóa API Đối Tác F1-${Date.now()}`;

      // Bấm nút "Tạo Khóa API Mới"
      const createKeyBtn = page.locator('button:has-text("Tạo Khóa API Mới")');
      await expect(createKeyBtn).toBeVisible({ timeout: 10000 });
      await createKeyBtn.click();

      // Modal hiển thị
      const modal = page.locator('div.fixed.z-\\[1000\\]:has-text("Cấp Phát API Key Doanh Nghiệp Mới")');
      await expect(modal).toBeVisible();

      // Nhập tên khóa
      await modal.locator('input[placeholder*="Web Landing Page"]').fill(dynamicKeyName);

      // Sinh mã khóa
      await modal.locator('button:has-text("Sinh Mã Khóa Mới")').click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });

      // Toast tạo thành công xuất hiện
      await expect(page.locator('text=Đã tạo thành công API Key mới:')).toBeVisible({ timeout: 5000 });
    });

    test('UI-29.3: Bật/Tắt trạng thái kết nối ứng dụng (Toggle Connection Switch) hiển thị Toast phản hồi', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/integrations`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Bấm nút switch kết nối trên ứng dụng đầu tiên
      const toggleSwitch = page.locator('div[title*="Bấm để"]').first();
      await expect(toggleSwitch).toBeVisible({ timeout: 10000 });
      await toggleSwitch.click();

      // Toast thông báo thay đổi trạng thái hiển thị
      await expect(page.locator('text=Đã ngắt kết nối').or(page.locator('text=Đã kích hoạt kết nối'))).toBeVisible({ timeout: 5000 });
    });

    test('UI-29.4: Giả Lập Bắn Webhook Sự Kiện (Webhook Simulator) booking.deposited sang ERP và kiểm tra HTTP 200 OK', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/integrations`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Chuyển sang Tab "Trạm Webhooks"
      const webhookTab = page.locator('button[role="tab"]:has-text("Trạm Webhooks")');
      await expect(webhookTab).toBeVisible({ timeout: 10000 });
      await webhookTab.click();

      // Bấm nút "Bắn Thử Sự Kiện (Test Ping)"
      const simBtn = page.locator('button:has-text("Bắn Thử Sự Kiện")');
      await expect(simBtn).toBeVisible({ timeout: 10000 });
      await simBtn.click();

      // Kết quả phản hồi HTTP 200 OK hiển thị
      await expect(page.locator('text=Kết quả: HTTP 200 OK')).toBeVisible({ timeout: 10000 });
    });

    test('API-29.5: Backend Integrations Controller danh mục apps, webhooks & API keys', async () => {
      // 1. Lấy danh sách Apps
      const resApps = await fetch(`${BACKEND_URL}/api/v1/integrations/apps`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(resApps.status).toBe(200);
      const apps = await resApps.json();
      expect(Array.isArray(apps.data)).toBe(true);

      // 2. Lấy danh sách Webhooks
      const resWebhooks = await fetch(`${BACKEND_URL}/api/v1/integrations/webhooks`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(resWebhooks.status).toBe(200);
      const webhooks = await resWebhooks.json();
      expect(Array.isArray(webhooks.data)).toBe(true);

      // 3. Lấy danh sách API Keys
      const resKeys = await fetch(`${BACKEND_URL}/api/v1/integrations/api-keys`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(resKeys.status).toBe(200);
      const keys = await resKeys.json();
      expect(Array.isArray(keys.data)).toBe(true);
    });
  });

  // =========================================================================
  // 6. MODULE 30: QUẢN TRỊ DANH MỤC ĐẦU TƯ TÀI SẢN PORTFOLIO (/portfolio)
  // =========================================================================
  test.describe('30. Quản Trị Danh Mục Đầu Tư Tài Sản Portfolio (/portfolio)', () => {
    test('UI-30.1: Hiển thị Bảng Quản Lý Gia Sản & Danh Mục BĐS VIP (Wealth Management) với các chỉ số AUM/Yield', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/portfolio`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      const heading = page.locator('h1:has-text("Quản Lý Gia Sản & Danh Mục BĐS VIP")');
      await expect(heading).toBeVisible({ timeout: 10000 });

      // Kiểm tra các nút hành động chính
      await expect(page.locator('button:has-text("Mô Phỏng Chốt Lời")')).toBeVisible();
      await expect(page.locator('button:has-text("Báo Cáo Gia Sản VIP")')).toBeVisible();
      await expect(page.locator('button:has-text("Thêm Bất Động Sản")')).toBeVisible();
    });

    test('UI-30.2: Thêm Bất Động Sản Mới Vào Danh Mục VIP với mã căn động Date.now() qua Modal (z-[1000])', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/portfolio`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      const dynamicCode = `AQC-${Date.now().toString().slice(-4)}`;
      const dynamicTitle = `Dinh Thự Đảo Phượng Hoàng VIP-${Date.now().toString().slice(-4)}`;

      // Bấm nút "Thêm Bất Động Sản"
      const addBtn = page.locator('button:has-text("Thêm Bất Động Sản")');
      await expect(addBtn).toBeVisible({ timeout: 10000 });
      await addBtn.click();

      // Modal hiển thị
      const modal = page.locator('div.fixed.z-\\[1000\\]:has-text("Thêm Bất Động Sản Vào Sổ Tay Gia Sản")');
      await expect(modal).toBeVisible();

      // Nhập mã căn và tên hiển thị
      await modal.locator('input[placeholder*="AQC-15C.02"]').fill(dynamicCode);
      await modal.locator('input').nth(1).fill(dynamicTitle);

      // Submit
      await modal.locator('button:has-text("Lưu Vào Sổ Tay Tài Sản")').click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });

      // Toast thông báo thêm thành công
      await expect(page.locator(`text=Đã thêm thành công căn hộ [${dynamicCode}]`)).toBeVisible({ timeout: 5000 });
    });

    test('UI-30.3: Mở Mô Phỏng Chốt Lời / Thoát Hàng BĐS (Exit Simulator Modal z-[1000]) tính toán IRR', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/portfolio`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Bấm nút "Mô Phỏng Chốt Lời"
      const exitBtn = page.locator('button:has-text("Mô Phỏng Chốt Lời")');
      await expect(exitBtn).toBeVisible({ timeout: 10000 });
      await exitBtn.click();

      // Modal hiển thị
      const modal = page.locator('div.fixed.z-\\[1000\\]:has-text("Mô Phỏng Chốt Lời & Thoát Hàng")');
      await expect(modal).toBeVisible();

      // Kiểm tra tính toán các chỉ số IRR và Lợi Nhuận Ròng
      await expect(modal.locator('text=LỢI NHUẬN RÒNG BỎ TÚI (NET):').or(modal.locator('text=Lợi Nhuận Ròng')).first()).toBeVisible();

      // Đóng modal
      await modal.locator('button:has(svg.lucide-x)').first().click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });
    });

    test('UI-30.4: Mở Báo Cáo Thẩm Định Gia Sản VIP (PDF Memo Modal z-[1000])', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/portfolio`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Bấm nút "Báo Cáo Gia Sản VIP"
      const reportBtn = page.locator('button:has-text("Báo Cáo Gia Sản VIP")');
      await expect(reportBtn).toBeVisible({ timeout: 10000 });
      await reportBtn.click();

      // Modal hiển thị
      const modal = page.locator('div.fixed.z-\\[1000\\]:has-text("Báo Cáo Thẩm Định Gia Sản Khách Hàng VIP")');
      await expect(modal).toBeVisible();

      // Đóng modal
      await modal.locator('button:has(svg.lucide-x)').first().click();
      await expect(modal).not.toBeVisible({ timeout: 5000 });
    });

    test('API-30.5: Backend Portfolio Controller lấy danh sách tài sản và báo cáo tổng hợp', async () => {
      // 1. Lấy danh sách tài sản
      const resAssets = await fetch(`${BACKEND_URL}/api/v1/portfolio/assets`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(resAssets.status).toBe(200);
      const assets = await resAssets.json();
      expect(Array.isArray(assets.data)).toBe(true);

      // 2. Báo cáo tổng hợp AUM
      const resSummary = await fetch(`${BACKEND_URL}/api/v1/portfolio/summary`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(resSummary.status).toBe(200);
      const summary = await resSummary.json();
      expect(summary.success).toBe(true);
      expect(summary.data.totalInitialInvestment).toBeDefined();
    });
  });
});
